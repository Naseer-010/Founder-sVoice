"""
agent.py — Main entrypoint for the Maneuver Voice AI Agent.

This is the primary executable that runs:
  1. The LiveKit Agent Server (handles WebRTC rooms + voice pipeline)
  2. A FastAPI token server (HTTP, for frontend auth)

Architecture:
  - Uses the latest AgentServer + @rtc_session pattern (LiveKit Agents v1.5+)
  - STT: Deepgram Nova-3 (streaming, low latency)
  - LLM: Google Gemini 2.5 Flash (via livekit-plugins-google)
  - TTS: Google TTS (server-side, streams audio back via WebRTC)
  - VAD: Silero (acoustic voice activity detection)

Run:
  uv run src/agent.py dev       # Development mode
  uv run src/agent.py console   # Terminal-only testing
"""

from __future__ import annotations

import logging
import os
import sys
import threading
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from livekit import agents
from livekit.agents import AgentServer, AgentSession, TurnHandlingOptions
from livekit.plugins import deepgram, google, silero

from src.config import load_environment

# Load environment variables
load_environment()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("maneuver.agent")


# ──────────────────────────────────────────────────────────────
# Token Server — runs in a background thread
# ──────────────────────────────────────────────────────────────

def start_token_server() -> None:
    """Start the FastAPI token server in a background thread."""
    import uvicorn
    from src.token_server import create_token_server

    app = create_token_server()
    config = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=8081,
        log_level="info",
    )
    server = uvicorn.Server(config)

    thread = threading.Thread(target=server.run, daemon=True, name="token-server")
    thread.start()
    logger.info("Token server started on http://localhost:8081")


# ──────────────────────────────────────────────────────────────
# Agent Server — LiveKit Agent entrypoint
# ──────────────────────────────────────────────────────────────

server = AgentServer()


@server.rtc_session(agent_name="maneuver-founder")
async def entrypoint(ctx: agents.JobContext) -> None:
    """
    Called when a new participant joins a room.
    Sets up the voice pipeline and starts the FounderAgent.
    """
    from src.founder_agent import FounderAgent

    logger.info("New session starting — room=%s", ctx.room.name)

    # Initialize the voice pipeline components
    session = AgentSession(
        # Speech-to-Text: Deepgram Nova-3 for streaming transcription
        stt=deepgram.STT(
            model="nova-3",
            language="en",
        ),
        # LLM: Gemini 2.5 Flash for ultra-fast inference
        llm=google.LLM(
            model="gemini-2.5-flash",
        ),
        # TTS: Google TTS for high-quality speech synthesis
        tts=google.TTS(
            language="en-US",
        ),
        # VAD: Silero for acoustic voice activity detection
        vad=silero.VAD.load(),
        # Turn handling: balanced for natural conversation
        turn_handling=TurnHandlingOptions(
            # Enable preemptive generation for lower latency
            # The agent starts generating before the user fully finishes
        ),
    )

    # Create the founder agent instance
    agent = FounderAgent()

    # Start the session
    await session.start(
        room=ctx.room,
        agent=agent,
    )

    # Greet the visitor
    await session.generate_reply(
        instructions=(
            "Greet the visitor warmly. Introduce yourself as Alex from Maneuver. "
            "Say something like 'Hey there! I'm Alex, the founder of Maneuver. "
            "Thanks for stopping by. What brings you here today?' "
            "Keep it short and natural — one to two sentences max."
        ),
    )

    logger.info("FounderAgent started — lead_id=%s", agent.lead_manager.lead_id)


# ──────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Start the token server for frontend auth
    start_token_server()

    # Run the LiveKit agent server (blocks)
    agents.cli.run_app(server)
