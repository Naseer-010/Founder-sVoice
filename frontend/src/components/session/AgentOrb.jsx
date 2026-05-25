/**
 * AgentOrb.jsx — State indicator for the voice agent.
 * Inline styles + framer-motion for smooth orb animations.
 */
import { motion } from "framer-motion";

const STATES = {
  initializing: { color: "#fbbf24", label: "Connecting" },
  listening:    { color: "#818cf8", label: "Listening" },
  thinking:     { color: "#a78bfa", label: "Analyzing" },
  speaking:     { color: "#34d399", label: "Speaking" },
};

export default function AgentOrb({ state = "initializing", size = 88 }) {
  const config = STATES[state] || STATES.initializing;
  const isSpeaking = state === "speaking";
  const isThinking = state === "thinking";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* Orb */}
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Outer pulse ring */}
        <motion.div
          style={{
            position: "absolute", inset: -6, borderRadius: "50%",
            border: `1.5px solid ${config.color}`, opacity: 0.2,
          }}
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

        {/* Second ring (visible during thinking/speaking) */}
        {(isThinking || isSpeaking) && (
          <motion.div
            style={{
              position: "absolute", inset: -14, borderRadius: "50%",
              border: `1px solid ${config.color}`, opacity: 0.12,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: isThinking ? 0.8 : 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        )}

        {/* Core circle */}
        <motion.div
          style={{
            width: size, height: size, borderRadius: "50%",
            background: `radial-gradient(circle at 40% 38%, ${config.color}45, ${config.color}12 70%, transparent)`,
            border: `1px solid ${config.color}25`,
          }}
          animate={isThinking ? { rotate: 360 } : {}}
          transition={isThinking ? { duration: 2.5, repeat: Infinity, ease: "linear" } : {}}
        />

        {/* Center dot */}
        <motion.div
          style={{
            position: "absolute", top: "50%", left: "50%",
            width: size * 0.16, height: size * 0.16, borderRadius: "50%",
            background: config.color,
            boxShadow: `0 0 14px ${config.color}60`,
          }}
          animate={{
            scale: isSpeaking ? [1, 1.5, 1] : [0.9, 1.1, 0.9],
            x: "-50%",
            y: "-50%",
          }}
          transition={{
            scale: {
              duration: isSpeaking ? 0.5 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      </div>

      {/* Status pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 99,
        background: "var(--color-bg-2)", border: "1px solid var(--color-line)",
        fontSize: 11, fontWeight: 500, color: "var(--color-fg-2)",
      }}>
        <motion.span
          style={{ width: 6, height: 6, borderRadius: "50%", background: config.color }}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {config.label}
      </div>
    </div>
  );
}
