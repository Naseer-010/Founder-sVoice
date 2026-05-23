/**
 * AgentOrb.jsx — Animated orb reflecting the agent's current state.
 *
 * States:
 *   - listening (cyan) — gentle pulse
 *   - thinking (purple) — spinning/morphing
 *   - speaking (emerald) — waveform/expanding rings
 *   - initializing (amber) — slow pulse
 *
 * Uses Framer Motion for smooth state transitions with spring physics.
 */

import { motion, AnimatePresence } from "framer-motion";
import { AGENT_STATES, STATE_COLORS } from "../../utils/constants";

const orbVariants = {
  listening: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  thinking: {
    rotate: [0, 360],
    scale: [1, 1.05, 1],
    transition: {
      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
      scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  },
  speaking: {
    scale: [1, 1.12, 1.05, 1.15, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  initializing: {
    scale: [1, 1.05, 1],
    opacity: [0.6, 0.9, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function AgentOrb({ state = AGENT_STATES.INITIALIZING, size = 120 }) {
  const stateConfig = STATE_COLORS[state] || STATE_COLORS[AGENT_STATES.INITIALIZING];
  const animationKey = state || "initializing";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 2, height: size * 2 }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          background: `radial-gradient(circle, ${stateConfig.glow}, transparent 70%)`,
        }}
        animate={{
          scale: state === AGENT_STATES.SPEAKING ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: state === AGENT_STATES.SPEAKING ? 0.6 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: size * 1.3,
          height: size * 1.3,
          borderColor: `${stateConfig.primary}33`,
        }}
        animate={orbVariants[animationKey]}
      />

      {/* Core orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%, ${stateConfig.primary}88, ${stateConfig.primary}44 60%, ${stateConfig.primary}11)`,
          boxShadow: `0 0 ${size / 3}px ${stateConfig.glow}, inset 0 0 ${size / 4}px ${stateConfig.primary}22`,
        }}
        animate={orbVariants[animationKey]}
        key={state}
        initial={{ scale: 0.9, opacity: 0.7 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      />

      {/* Inner highlight */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          background: `radial-gradient(circle, ${stateConfig.primary}66, transparent)`,
          top: `calc(50% - ${size * 0.28}px)`,
          left: `calc(50% - ${size * 0.12}px)`,
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* State label */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={state + "-label"}
      >
        <div
          className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide"
          style={{
            background: `${stateConfig.primary}22`,
            color: stateConfig.primary,
            border: `1px solid ${stateConfig.primary}33`,
          }}
        >
          {stateConfig.label}
        </div>
      </motion.div>
    </div>
  );
}
