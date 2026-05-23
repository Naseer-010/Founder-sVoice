"""
knowledge_base.py — Knowledge base loader and context provider for the Maneuver agent.

Design: Loads the Maneuver knowledge base markdown file at startup and provides
it as context for the LLM system prompt. Uses lazy loading pattern with caching.
"""

from __future__ import annotations

import logging
from pathlib import Path
from functools import lru_cache

logger = logging.getLogger(__name__)

# Resolve paths relative to this file's location
_DATA_DIR = Path(__file__).resolve().parent.parent / "data"
_KB_FILE = _DATA_DIR / "maneuver_kb.md"


@lru_cache(maxsize=1)
def load_knowledge_base() -> str:
    """
    Load the Maneuver knowledge base from disk.
    
    Returns the full markdown content as a string. Cached after first call
    since the KB doesn't change during runtime.
    
    Raises:
        FileNotFoundError: If the KB file is missing.
    """
    if not _KB_FILE.exists():
        logger.error("Knowledge base file not found at %s", _KB_FILE)
        raise FileNotFoundError(
            f"Knowledge base not found: {_KB_FILE}. "
            f"Expected at agent/data/maneuver_kb.md"
        )

    content = _KB_FILE.read_text(encoding="utf-8")
    logger.info(
        "Loaded knowledge base: %d characters from %s",
        len(content),
        _KB_FILE.name,
    )
    return content


def get_kb_section(section_name: str) -> str | None:
    """
    Extract a specific section from the knowledge base by heading name.
    
    Args:
        section_name: The heading text to search for (case-insensitive).
        
    Returns:
        The section content, or None if not found.
    """
    content = load_knowledge_base()
    lines = content.split("\n")
    
    section_lines: list[str] = []
    in_section = False
    section_level = 0

    for line in lines:
        # Check if this is a heading
        if line.startswith("#"):
            heading_level = len(line) - len(line.lstrip("#"))
            heading_text = line.lstrip("#").strip()

            if heading_text.lower() == section_name.lower():
                in_section = True
                section_level = heading_level
                continue
            elif in_section and heading_level <= section_level:
                # We've hit a same-level or higher heading, stop
                break

        if in_section:
            section_lines.append(line)

    if not section_lines:
        return None

    return "\n".join(section_lines).strip()
