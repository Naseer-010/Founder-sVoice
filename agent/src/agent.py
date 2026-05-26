"""
agent.py — Main entrypoint for the Maneuver Voice AI Agent.

Pipeline:
  Mic → LiveKit → Deepgram STT (Nova-3) → Groq LLM (Llama 3 8B) → Deepgram TTS (Aura Asteria) → Speaker

  TTS is MODULAR — controlled by TTS_MODE env var:
    "deepgram" (default) — Deepgram Aura TTS (uses DEEPGRAM_API_KEY).
    "browser"  (fallback) — No server TTS. Text streams to frontend, browser speaks it.
"""

from __future__ import annotations

import logging
import os
import sys
import threading
from pathlib import Path

from livekit import agents
from livekit.agents import AgentServer, AgentSession, TurnHandlingOptions
from livekit.plugins import deepgram, groq, silero, google

from config import load_environment

# Ensure src/ is on sys.path so bare imports work (config, token_server, etc.)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = Path(__file__).resolve().parent
for p in (str(PROJECT_ROOT), str(SRC_DIR)):
    if p not in sys.path:
        sys.path.insert(0, p)


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
      "deepgram" (default) — Deepgram Aura TTS (voice: aura-asteria-en).
      "browser"  (fallback) — returns None. Frontend handles TTS via SpeechSynthesis.
    """
    mode = os.environ.get("TTS_MODE", "deepgram").lower().strip()

    if mode == "deepgram":
        try:
            engine = deepgram.TTS(model="aura-asteria-en")
            logger.info(
                "TTS_MODE=deepgram — using Deepgram Aura TTS (voice=aura-asteria-en)"
            )
            return engine
        except Exception as e:
            logger.error("Deepgram TTS failed: %s — falling back to browser TTS", e)
            return None

    if mode == "browser":
        logger.info(
            "TTS_MODE=browser — no server TTS, frontend will use SpeechSynthesis"
        )
        return None

    logger.warning("Unknown TTS_MODE=%s — defaulting to deepgram", mode)
    try:
        engine = deepgram.TTS(model="aura-asteria-en")
        return engine
    except Exception as e:
        logger.error("Deepgram TTS fallback failed: %s — using browser TTS", e)
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
        llm=google.LLM(
            model="gemini-2.5-flash",
            max_output_tokens=800,
        ),
        vad=silero.VAD.load(
            min_silence_duration=1.0,
            min_speech_duration=0.3,
            activation_threshold=0.8,
        ),
        turn_handling=TurnHandlingOptions(preemptive_generation=None),
    )
    # Only add TTS if we have a server-side engine
    if tts_engine is not None:
        session_kwargs["tts"] = tts_engine

    session = AgentSession(**session_kwargs)
    agent = FounderAgent()

    agent.room = ctx.room

    await session.start(room=ctx.room, agent=agent)

    if tts_engine is None:
        session.output.set_audio_enabled(False)

    # Greet the visitor
    await session.generate_reply(
        instructions=(
            "Greet the visitor warmly. Introduce yourself as Founder from Maneuver. "
            "Say something like 'Hey there, I'm Founder from Maneuver. "
            "Thanks for stopping by — what brings you here today?' "
            "Keep it to one or two sentences."
        ),
    )

    logger.info("Agent started — lead_id=%s", agent.lead_manager.lead_id)


# ── Main ──────────────────────────────────────────────────────

if __name__ == "__main__":
    start_token_server()
    agents.cli.run_app(server)
