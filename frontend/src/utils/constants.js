/**
 * constants.js — Application-wide constants
 */

export const LIVEKIT_CONFIG = {
  TOKEN_ENDPOINT: "/api/token",
  DEFAULT_ROOM: "maneuver-discovery",
};

export const AGENT_STATES = {
  INITIALIZING: "initializing",
  LISTENING: "listening",
  THINKING: "thinking",
  SPEAKING: "speaking",
};

export const VISUAL_TYPES = {
  WELCOME: "welcome",
  SERVICES_OVERVIEW: "services_overview",
  SERVICE_DETAIL: "service_detail",
  PROCESS_DIAGRAM: "process_diagram",
  CASE_STUDY: "case_study",
};

export const LEAD_FIELDS = {
  name: { label: "Name", icon: "👤" },
  company: { label: "Company", icon: "🏢" },
  role: { label: "Role", icon: "💼" },
  email: { label: "Email", icon: "✉️" },
  problem: { label: "Problem", icon: "🎯" },
  timeline: { label: "Timeline", icon: "📅" },
  budget: { label: "Budget", icon: "💰" },
  notes: { label: "Notes", icon: "📝" },
};

export const STATE_COLORS = {
  [AGENT_STATES.LISTENING]: {
    primary: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.3)",
    label: "Listening",
  },
  [AGENT_STATES.THINKING]: {
    primary: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.3)",
    label: "Thinking",
  },
  [AGENT_STATES.SPEAKING]: {
    primary: "#10b981",
    glow: "rgba(16, 185, 129, 0.3)",
    label: "Speaking",
  },
  [AGENT_STATES.INITIALIZING]: {
    primary: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.3)",
    label: "Connecting",
  },
};
