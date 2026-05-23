"""
founder_agent.py — The core Maneuver Founder AI Agent.

Architecture: Extends livekit.agents.Agent with @function_tool decorated methods
that serve dual purposes:
  1. Provide structured actions the LLM can invoke during conversation
  2. Trigger synchronized visual updates on the frontend via LiveKit RPC

Design Principles:
  - Single Responsibility: Agent handles conversation logic only
  - Dependency Injection: LeadManager injected at construction
  - Open/Closed: New tools can be added without modifying existing ones
"""

from __future__ import annotations

import json
import logging
from typing import Any

from livekit.agents import Agent, RunContext, function_tool

from .lead_manager import LeadManager
from .knowledge_base import load_knowledge_base
from .prompts import build_system_prompt

logger = logging.getLogger(__name__)


class FounderAgent(Agent):
    """
    AI agent that represents Maneuver's founder in voice conversations.
    
    Handles two conversation modes in a single agent:
    - Discovery Mode: Proactively asks questions to capture lead info
    - Q&A Mode: Answers questions about Maneuver from knowledge base
    
    The agent fluidly switches between modes based on conversation context.
    """

    def __init__(self) -> None:
        # Load knowledge base and build system prompt
        kb_content = load_knowledge_base()
        system_prompt = build_system_prompt(kb_content)

        super().__init__(instructions=system_prompt)

        # Each agent instance gets its own lead manager
        self._lead_manager = LeadManager()
        logger.info(
            "FounderAgent initialized — lead_id=%s",
            self._lead_manager.lead_id,
        )

    @property
    def lead_manager(self) -> LeadManager:
        return self._lead_manager

    # ──────────────────────────────────────────────────────────────
    # Visual Layer Tools — These trigger frontend UI updates via RPC
    # ──────────────────────────────────────────────────────────────

    @function_tool()
    async def show_services_slide(self, ctx: RunContext) -> str:
        """
        Display the Maneuver services overview slide on the visitor's screen.
        Call this when discussing what services Maneuver offers.
        """
        await self._send_rpc(ctx, "show_visual", {
            "type": "services_overview",
            "data": {
                "services": [
                    {
                        "name": "Product Strategy & Discovery",
                        "icon": "strategy",
                        "description": "Validate ideas with intensive discovery sprints before writing code.",
                    },
                    {
                        "name": "UI/UX Design",
                        "icon": "design",
                        "description": "User-centered design from wireframes to high-fidelity prototypes.",
                    },
                    {
                        "name": "Full-Stack Engineering",
                        "icon": "engineering",
                        "description": "Modern web and mobile apps with React, Node.js, Python, and cloud.",
                    },
                    {
                        "name": "AI & ML Integration",
                        "icon": "ai",
                        "description": "LLM features, custom ML models, recommendation engines, and more.",
                    },
                    {
                        "name": "Growth & Launch Support",
                        "icon": "growth",
                        "description": "Launch strategy, analytics, A/B testing, and post-launch support.",
                    },
                ],
            },
        })
        return "Services overview is now displayed on the visitor's screen."

    @function_tool()
    async def show_service_detail(
        self, ctx: RunContext, service_name: str
    ) -> str:
        """
        Zoom into a specific Maneuver service with detailed information.
        Call this when the visitor asks about a particular service.
        
        Args:
            service_name: The name of the service to show details for.
        """
        service_details = {
            "product strategy": {
                "name": "Product Strategy & Discovery",
                "description": "We run intensive discovery sprints to validate ideas before writing a single line of code.",
                "includes": [
                    "User research & interviews",
                    "Competitive analysis",
                    "Market sizing",
                    "Feature prioritization",
                    "Technical feasibility assessment",
                ],
                "timeline": "2-3 week sprint",
                "icon": "strategy",
            },
            "design": {
                "name": "UI/UX Design",
                "description": "Full-service product design backed by real user insight.",
                "includes": [
                    "User journey mapping",
                    "Wireframes & prototypes",
                    "High-fidelity UI design",
                    "Design system creation",
                    "Usability testing",
                ],
                "timeline": "2-4 weeks",
                "icon": "design",
            },
            "engineering": {
                "name": "Full-Stack Engineering",
                "description": "Production-grade web and mobile applications.",
                "includes": [
                    "React / Next.js frontends",
                    "Node.js / Python backends",
                    "Cloud infrastructure (AWS/GCP)",
                    "CI/CD pipelines",
                    "Automated testing",
                ],
                "timeline": "6-16 weeks for MVP",
                "icon": "engineering",
            },
            "ai": {
                "name": "AI & Machine Learning",
                "description": "Integrate cutting-edge AI into your product.",
                "includes": [
                    "LLM-powered features",
                    "Custom ML models",
                    "Recommendation engines",
                    "Intelligent search",
                    "Data pipeline architecture",
                ],
                "timeline": "4-12 weeks",
                "icon": "ai",
            },
            "growth": {
                "name": "Growth & Launch Support",
                "description": "We help you launch and grow, not just build.",
                "includes": [
                    "Go-to-market strategy",
                    "Analytics & tracking setup",
                    "A/B testing framework",
                    "Performance optimization",
                    "First 90 days support",
                ],
                "timeline": "Ongoing",
                "icon": "growth",
            },
        }

        # Fuzzy match the service name
        key = service_name.lower().strip()
        detail = None
        for k, v in service_details.items():
            if k in key or key in k or key in v["name"].lower():
                detail = v
                break

        if not detail:
            detail = service_details.get("engineering", list(service_details.values())[0])

        await self._send_rpc(ctx, "show_visual", {
            "type": "service_detail",
            "data": detail,
        })
        return f"Showing detailed view for {detail['name']}."

    @function_tool()
    async def show_process_diagram(self, ctx: RunContext) -> str:
        """
        Display Maneuver's engagement process diagram on the visitor's screen.
        Call this when explaining how Maneuver works or the engagement process.
        """
        await self._send_rpc(ctx, "show_visual", {
            "type": "process_diagram",
            "data": {
                "steps": [
                    {"number": 1, "title": "Discovery Call", "description": "30-min conversation to understand your vision", "status": "active"},
                    {"number": 2, "title": "Proposal", "description": "Detailed scope, timeline & pricing in 48 hours", "status": "upcoming"},
                    {"number": 3, "title": "Design Sprint", "description": "1-2 week sprint to nail UX & architecture", "status": "upcoming"},
                    {"number": 4, "title": "Build & Iterate", "description": "Agile 2-week sprints with regular demos", "status": "upcoming"},
                    {"number": 5, "title": "Launch & Handoff", "description": "Deployment, docs & knowledge transfer", "status": "upcoming"},
                ],
            },
        })
        return "Process diagram is now displayed."

    @function_tool()
    async def show_case_study(self, ctx: RunContext, case_name: str) -> str:
        """
        Display a case study card on the visitor's screen.
        Call this when referencing a specific past project or case study.
        
        Args:
            case_name: Name or topic of the case study to display.
        """
        case_studies = {
            "finflow": {
                "name": "FinFlow",
                "industry": "Fintech",
                "challenge": "Build an MVP for automated invoice processing",
                "solution": "Full-stack web app with AI-powered document extraction",
                "result": "Secured $2.5M seed funding within 3 months",
                "timeline": "8 weeks",
            },
            "healthbridge": {
                "name": "HealthBridge",
                "industry": "Healthcare",
                "challenge": "Patient portal integrating with existing EHR systems",
                "solution": "HIPAA-compliant patient engagement platform",
                "result": "85% adoption rate, 40% reduction in admin calls",
                "timeline": "12 weeks",
            },
            "retailpulse": {
                "name": "RetailPulse",
                "industry": "E-commerce",
                "challenge": "Scale recommendation engine for growing marketplace",
                "solution": "Custom ML pipeline processing 10M+ events/day",
                "result": "23% increase in AOV, 15% better conversion",
                "timeline": "10 weeks",
            },
        }

        key = case_name.lower().strip()
        study = None
        for k, v in case_studies.items():
            if k in key or key in k or key in v["name"].lower():
                study = v
                break

        if not study:
            study = list(case_studies.values())[0]

        await self._send_rpc(ctx, "show_visual", {
            "type": "case_study",
            "data": study,
        })
        return f"Showing case study for {study['name']}."

    # ──────────────────────────────────────────────────────────────
    # Lead Capture Tools
    # ──────────────────────────────────────────────────────────────

    @function_tool()
    async def update_lead_field(
        self, ctx: RunContext, field: str, value: str
    ) -> str:
        """
        Capture a piece of information about the visitor during the discovery call.
        Call this IMMEDIATELY when you learn any new information.
        
        Args:
            field: The field to update. Must be one of: name, company, role, email, problem, timeline, budget, notes
            value: The value to set for the field.
        """
        try:
            result = self._lead_manager.update_field(field, value)

            # Notify frontend to update lead panel
            await self._send_rpc(ctx, "update_lead", {
                "field": result["field"],
                "value": result["value"],
                "all_fields": self._lead_manager.get_captured_fields(),
            })

            return f"Captured {field}: {value}"
        except ValueError as e:
            logger.warning("Invalid lead field update: %s", e)
            return str(e)

    @function_tool()
    async def end_discovery_call(self, ctx: RunContext) -> str:
        """
        End the discovery call and save all captured information.
        Call this when the conversation is wrapping up or the visitor says goodbye.
        """
        filepath = self._lead_manager.persist()

        await self._send_rpc(ctx, "call_ended", {
            "lead_id": self._lead_manager.lead_id,
            "captured_fields": self._lead_manager.get_captured_fields(),
            "is_complete": self._lead_manager.lead.is_complete(),
        })

        return (
            f"Discovery data saved (lead ID: {self._lead_manager.lead_id}). "
            f"File: {filepath.name}"
        )

    # ──────────────────────────────────────────────────────────────
    # Internal Helpers
    # ──────────────────────────────────────────────────────────────

    async def _send_rpc(
        self, ctx: RunContext, method: str, payload: dict[str, Any]
    ) -> None:
        """
        Send an RPC call to the frontend participant.
        
        Finds the first non-agent participant in the room and sends the RPC.
        Fails silently if no frontend participant is connected (graceful degradation).
        """
        session = ctx.session
        room = session.room

        if room is None:
            logger.warning("No room available for RPC call")
            return

        # Find the frontend participant (non-agent)
        target = None
        for participant in room.remote_participants.values():
            target = participant
            break

        if target is None:
            logger.warning("No frontend participant found for RPC")
            return

        try:
            await room.local_participant.perform_rpc(
                destination_identity=target.identity,
                method=method,
                payload=json.dumps(payload),
            )
            logger.debug("RPC sent: method=%s to=%s", method, target.identity)
        except Exception as e:
            # Graceful degradation — visual layer is optional
            logger.warning("RPC call failed (non-fatal): %s", e)
