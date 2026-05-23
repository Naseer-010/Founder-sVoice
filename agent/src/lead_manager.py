"""
lead_manager.py — Lead capture and persistence for discovery calls.

Design: Thread-safe lead data management with JSON persistence.
Each call creates a new lead record that gets progressively filled
as the agent captures information during the conversation.

Follows the Repository pattern — abstracts storage from business logic.
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Any

logger = logging.getLogger(__name__)

_LEADS_DIR = Path(__file__).resolve().parent.parent / "data" / "leads"


@dataclass
class LeadRecord:
    """Represents a single discovery call lead."""

    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    name: str = ""
    company: str = ""
    role: str = ""
    email: str = ""
    problem: str = ""
    timeline: str = ""
    budget: str = ""
    notes: str = ""
    call_duration_seconds: float = 0.0
    transcript_summary: str = ""

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    def is_complete(self) -> bool:
        """Check if minimum required fields are captured."""
        return bool(self.name and self.problem)


class LeadManager:
    """
    Manages lead capture during a single discovery call session.
    
    Usage:
        manager = LeadManager()
        manager.update_field("name", "John Doe")
        manager.update_field("company", "Acme Corp")
        manager.persist()  # Saves to disk
    """

    def __init__(self) -> None:
        self._lead = LeadRecord()
        self._persisted = False
        logger.info("LeadManager initialized — lead_id=%s", self._lead.id)

    @property
    def lead(self) -> LeadRecord:
        return self._lead

    @property
    def lead_id(self) -> str:
        return self._lead.id

    def update_field(self, field_name: str, value: str) -> dict[str, str]:
        """
        Update a single field on the lead record.
        
        Args:
            field_name: One of the LeadRecord field names.
            value: The value to set.
            
        Returns:
            Dict with the updated field for frontend confirmation.
            
        Raises:
            ValueError: If field_name is not a valid lead field.
        """
        valid_fields = {
            "name", "company", "role", "email",
            "problem", "timeline", "budget", "notes",
        }

        field_name = field_name.lower().strip()
        if field_name not in valid_fields:
            raise ValueError(
                f"Invalid lead field: '{field_name}'. "
                f"Valid fields: {', '.join(sorted(valid_fields))}"
            )

        # For notes, append rather than replace
        if field_name == "notes" and self._lead.notes:
            self._lead.notes += f" | {value}"
        else:
            setattr(self._lead, field_name, value.strip())

        logger.info(
            "Lead updated — lead_id=%s field=%s value=%s",
            self._lead.id,
            field_name,
            value[:50],
        )
        return {"field": field_name, "value": getattr(self._lead, field_name)}

    def get_captured_fields(self) -> dict[str, str]:
        """Return only non-empty fields for display."""
        data = self._lead.to_dict()
        return {
            k: v for k, v in data.items()
            if v and k not in ("id", "created_at", "call_duration_seconds", "transcript_summary")
        }

    def persist(self) -> Path:
        """
        Save the lead record to a JSON file.
        
        Returns:
            Path to the saved file.
        """
        _LEADS_DIR.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        filename = f"lead_{self._lead.id}_{timestamp}.json"
        filepath = _LEADS_DIR / filename

        filepath.write_text(
            json.dumps(self._lead.to_dict(), indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        self._persisted = True
        logger.info("Lead persisted to %s", filepath)
        return filepath

    @staticmethod
    def load_all_leads() -> list[dict[str, Any]]:
        """Load all persisted leads from disk. Used by admin endpoint."""
        if not _LEADS_DIR.exists():
            return []

        leads = []
        for f in sorted(_LEADS_DIR.glob("lead_*.json"), reverse=True):
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
                leads.append(data)
            except (json.JSONDecodeError, OSError) as e:
                logger.warning("Failed to load lead file %s: %s", f.name, e)

        return leads
