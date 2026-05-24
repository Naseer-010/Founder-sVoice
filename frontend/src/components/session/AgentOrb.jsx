/**
 * AgentOrb.jsx — Minimal state indicator for the agent.
 * Clean, monochrome with a single accent color per state.
 */

import { motion } from "framer-motion";

const STATE_CONFIG = {
  initializing: { color: "#fbbf24", label: "Connecting" },
  listening:    { color: "#818cf8", label: "Listening" },
  thinking:     { color: "#a78bfa", label: "Thinking" },
  speaking:     { color: "#34d399", label: "Speaking" },
};

export default function AgentOrb({ state = "initializing", size = 96 }) {
  const config = STATE_CONFIG[state] || STATE_CONFIG.initializing;
  const isSpeaking = state === "speaking";
  const isThinking = state === "thinking";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Orb container */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${config.color}`, opacity: 0.2 }}
          animate={{
            scale: isSpeaking ? [1, 1.35, 1] : [1, 1.15, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: isSpeaking ? 0.7 : 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Core circle */}
        <motion.div
          className="absolute inset-3 rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 38%, ${config.color}40, ${config.color}18 65%, transparent)`,
            border: `1px solid ${config.color}30`,
          }}
          animate={isThinking ? { rotate: 360 } : {}}
          transition={isThinking ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
        />

        {/* Inner dot */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            background: config.color,
            boxShadow: `0 0 12px ${config.color}60`,
          }}
          animate={{
            scale: isSpeaking ? [1, 1.5, 1] : [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: isSpeaking ? 0.5 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* State label */}
      <span className="pill" style={{ color: config.color, borderColor: `${config.color}30` }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
        {config.label}
      </span>
    </div>
  );
}
