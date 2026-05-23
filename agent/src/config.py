"""Runtime configuration helpers for the Maneuver agent."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


ENV_FILES = (".env.local", ".env", ".env.example")


def load_environment() -> None:
    """Load environment files from the agent directory in precedence order."""
    agent_dir = Path(__file__).resolve().parents[1]

    for filename in ENV_FILES:
        load_dotenv(agent_dir / filename)


@dataclass(frozen=True)
class LiveKitSettings:
    url: str
    api_key: str
    api_secret: str


def get_livekit_settings() -> tuple[LiveKitSettings | None, list[str]]:
    """Return LiveKit settings and the names of any missing variables."""
    load_environment()

    values = {
        "LIVEKIT_URL": os.environ.get("LIVEKIT_URL", "").strip(),
        "LIVEKIT_API_KEY": os.environ.get("LIVEKIT_API_KEY", "").strip(),
        "LIVEKIT_API_SECRET": os.environ.get("LIVEKIT_API_SECRET", "").strip(),
    }
    missing = [key for key, value in values.items() if not value]

    if missing:
        return None, missing

    return (
        LiveKitSettings(
            url=values["LIVEKIT_URL"],
            api_key=values["LIVEKIT_API_KEY"],
            api_secret=values["LIVEKIT_API_SECRET"],
        ),
        [],
    )
