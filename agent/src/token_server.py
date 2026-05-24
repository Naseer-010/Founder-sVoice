"""
token_server.py — FastAPI server for LiveKit token generation and lead retrieval.

Architecture: Lightweight HTTP server running alongside the LiveKit agent.
Provides two endpoints:
  - POST /api/token  — Generate LiveKit JWT for frontend clients
  - GET  /api/leads  — Retrieve captured leads (admin/demo)

Security: In production, the token endpoint should have authentication.
For this assignment, it's open for local development.
"""

from __future__ import annotations

import logging
import re
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from livekit.api import AccessToken, VideoGrants

from .config import get_livekit_settings
from .lead_manager import LeadManager

logger = logging.getLogger(__name__)


def create_token_server() -> FastAPI:
    """Factory function to create the FastAPI token server."""

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        logger.info("Token server starting...")
        yield
        logger.info("Token server shutting down...")

    app = FastAPI(
        title="Maneuver Voice Agent — Token Server",
        version="1.0.0",
        lifespan=lifespan,
    )

    # CORS — allow frontend dev server
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.post("/api/token")
    async def generate_token(
        room_name: str = "maneuver-discovery",
        participant_name: str | None = None,
    ) -> JSONResponse:
        """
        Generate a LiveKit access token for the frontend to join a room.
        
        Query params:
            room_name: Name of the room to join (default: maneuver-discovery)
            participant_name: Display name for the participant (auto-generated if not provided)
        """
        settings, missing = get_livekit_settings()

        if settings is None:
            logger.error("Token request failed because config is missing: %s", ", ".join(missing))
            raise HTTPException(
                status_code=503,
                detail={
                    "message": "LiveKit is not configured on the backend.",
                    "missing": missing,
                    "hint": "Add these values to agent/.env, then restart `uv run src/agent.py dev`.",
                },
            )

        display_name = (participant_name or "Visitor").strip()[:64]
        identity_prefix = re.sub(r"[^a-zA-Z0-9_-]+", "-", display_name.lower()).strip("-")
        identity = f"{identity_prefix or 'visitor'}-{uuid.uuid4().hex[:8]}"

        token = AccessToken(settings.api_key, settings.api_secret) \
            .with_identity(identity) \
            .with_name(display_name) \
            .with_grants(VideoGrants(
                room_join=True,
                room=room_name,
                can_publish=True,
                can_subscribe=True,
            ))

        jwt = token.to_jwt()

        logger.info(
            "Token generated — room=%s identity=%s",
            room_name,
            identity,
        )

        return JSONResponse({
            "token": jwt,
            "url": settings.url,
            "room_name": room_name,
            "identity": identity,
        })

    @app.get("/api/leads")
    async def list_leads() -> JSONResponse:
        """Return all captured leads from discovery calls."""
        leads = LeadManager.load_all_leads()
        return JSONResponse({"leads": leads, "total": len(leads)})

    @app.get("/api/health")
    async def health() -> JSONResponse:
        settings, missing = get_livekit_settings()
        return JSONResponse({
            "status": "ok",
            "service": "maneuver-voice-agent",
            "livekit_configured": settings is not None,
            "missing": missing,
        })

    return app
