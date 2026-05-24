/**
 * AgentOrb.jsx — State indicator for the voice agent.
 * Shows: connecting → listening → thinking (analyzing) → speaking
 */

const STATES = {
  initializing: { color: "#fbbf24", label: "Connecting",  anim: "2.5s" },
  listening:    { color: "#818cf8", label: "Listening",   anim: "3s" },
  thinking:     { color: "#a78bfa", label: "Analyzing",   anim: "1.2s" },
  speaking:     { color: "#34d399", label: "Speaking",    anim: "0.6s" },
};

export default function AgentOrb({ state = "initializing" }) {
  const { color, label, anim } = STATES[state] || STATES.initializing;
  const isThinking = state === "thinking";
  const isSpeaking = state === "speaking";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* Orb */}
      <div style={{ position: "relative", width: 88, height: 88 }}>
        {/* Outer ring */}
        <div style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          border: `1.5px solid ${color}`,
          opacity: 0.25,
          animation: `pulse-soft ${anim} ease-in-out infinite`,
        }} />

        {/* Second ring (visible during thinking/speaking) */}
        {(isThinking || isSpeaking) && (
          <div style={{
            position: "absolute", inset: -14, borderRadius: "50%",
            border: `1px solid ${color}`,
            opacity: 0.12,
            animation: `pulse-soft ${isThinking ? "0.8s" : "1s"} ease-in-out infinite`,
            animationDelay: "0.2s",
          }} />
        )}

        {/* Core circle */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: `radial-gradient(circle at 40% 38%, ${color}45, ${color}12 70%, transparent)`,
          border: `1px solid ${color}25`,
          animation: isThinking ? `spin 2.5s linear infinite` : undefined,
        }} />

        {/* Center dot */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: "50%",
          background: color,
          boxShadow: `0 0 14px ${color}60`,
          animation: `pulse-soft ${anim} ease-in-out infinite`,
        }} />
      </div>

      {/* Status pill */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 99,
        background: "var(--color-bg-2)", border: "1px solid var(--color-line)",
        fontSize: 11, fontWeight: 500, color: "var(--color-fg-2)",
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: color,
          animation: `pulse-soft ${anim} ease-in-out infinite`,
        }} />
        {label}
      </div>
    </div>
  );
}
