"""
agent.py — Main entrypoint for the Maneuver Voice AI Agent.

Pipeline:
  Mic → LiveKit → Deepgram STT → Gemini 2.5 Flash → text transcription → Frontend
  
  TTS is MODULAR — controlled by TTS_MODE env var:
    "browser"  (default) — No server TTS. Text streams to frontend, browser speaks it.
    "google"             — Google Cloud TTS (needs GOOGLE_APPLICATION_CREDENTIALS).
    "gemini"             — Gemini-native TTS via google.beta.TTS (uses GOOGLE_API_KEY).
"""

from __future__ import annotations

import logging
import os
import sys
import threading
from pathlib import Path

# Ensure src/ is on sys.path so bare imports work (config, token_server, etc.)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = Path(__file__).resolve().parent
for p in (str(PROJECT_ROOT), str(SRC_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)

from livekit import agents
from livekit.agents import AgentServer, AgentSession
from livekit.plugins import deepgram, google, silero

from config import load_environment

load_environment()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("maneuver.agent")


# ── Token Server ──────────────────────────────────────────────

def start_token_server() -> None:
    import uvicorn
    from token_server import create_token_server

    app = create_token_server()
    config = uvicorn.Config(app, host="0.0.0.0", port=8081, log_level="info")
    srv = uvicorn.Server(config)
    thread = threading.Thread(target=srv.run, daemon=True, name="token-server")
    thread.start()
    logger.info("Token server started on http://localhost:8081")


# ── TTS Factory ───────────────────────────────────────────────

def build_tts():
    """
    Build a TTS engine based on TTS_MODE env var.
    
    Modes:
      "browser" — returns None. The frontend handles TTS via SpeechSynthesis.
      "gemini"  — Gemini-native TTS (uses GOOGLE_API_KEY, same as LLM).
      "google"  — Google Cloud TTS (needs GOOGLE_APPLICATION_CREDENTIALS JSON).
    """
    mode = os.environ.get("TTS_MODE", "browser").lower().strip()

    if mode == "browser":
        logger.info("TTS_MODE=browser — no server TTS, frontend will use SpeechSynthesis")
        return None

    if mode == "gemini":
        try:
            engine = google.beta.TTS(voice="Kore", language="en-US")
            logger.info("TTS_MODE=gemini — using Gemini TTS (voice=Kore)")
            return engine
        except (AttributeError, Exception) as e:
            logger.error("Gemini TTS failed: %s — falling back to browser TTS", e)
            return None

    if mode == "google":
        try:
            engine = google.TTS(language="en-US")
            logger.info("TTS_MODE=google — using Google Cloud TTS")
            return engine
        except Exception as e:
            logger.error("Google Cloud TTS failed: %s — falling back to browser TTS", e)
            return None

    logger.warning("Unknown TTS_MODE=%s — defaulting to browser", mode)
    return None


# ── Agent Server ──────────────────────────────────────────────

server = AgentServer()


@server.rtc_session()
async def entrypoint(ctx: agents.JobContext) -> None:
    from founder_agent import FounderAgent

    logger.info("New session — room=%s", ctx.room.name)

    tts_engine = build_tts()

    session_kwargs = dict(
        stt=deepgram.STT(model="nova-3", language="en"),
        llm=google.LLM(model="gemini-2.5-flash"),
        vad=silero.VAD.load(),
    )
    # Only add TTS if we have a server-side engine
    if tts_engine is not None:
        session_kwargs["tts"] = tts_engine

    session = AgentSession(**session_kwargs)
    agent = FounderAgent()

    await session.start(room=ctx.room, agent=agent)

    # Greet the visitor
    await session.generate_reply(
        instructions=(
            "Greet the visitor warmly. Introduce yourself as Alex from Maneuver. "
            "Say something like 'Hey there, I'm Alex from Maneuver. "
            "Thanks for stopping by — what brings you here today?' "
            "Keep it to one or two sentences."
        ),
    )

    logger.info("Agent started — lead_id=%s", agent.lead_manager.lead_id)


# ── Main ──────────────────────────────────────────────────────

if __name__ == "__main__":
    start_token_server()
    agents.cli.run_app(server)
