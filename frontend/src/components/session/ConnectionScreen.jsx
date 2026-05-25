/**
 * ConnectionScreen.jsx — Landing page. Inline styles + framer-motion entry.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConnectionScreen({ onConnect, isConnecting, error }) {
  const [name, setName] = useState("");

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 400, textAlign: "center" }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 40 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>Maneuver</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 12 }}>
          Talk to our founder
        </h1>
        <p style={{ color: "var(--color-fg-2)", fontSize: 15, lineHeight: 1.6, marginBottom: 36, maxWidth: 340, marginInline: "auto" }}>
          Have a real voice conversation with Alex. Share what you're building, ask questions, see if we're a fit.
        </p>

        {/* Form */}
        <div className="card" style={{ padding: 24, textAlign: "left" }}>
          <label className="label" style={{ display: "block", marginBottom: 8 }}>Your name</label>
          <input
            id="visitor-name-input"
            type="text"
            placeholder="Optional"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onConnect(name || undefined)}
            disabled={isConnecting}
            style={{
              width: "100%", padding: "10px 14px", fontSize: 14,
              background: "var(--color-bg-2)", border: "1px solid var(--color-line)",
              borderRadius: 8, color: "var(--color-fg)", outline: "none", marginBottom: 16,
            }}
          />
          <button
            id="start-conversation-btn"
            onClick={() => onConnect(name || undefined)}
            disabled={isConnecting}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {isConnecting ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
                Connecting…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
                Start conversation
              </>
            )}
          </button>
          <p style={{ color: "var(--color-fg-3)", fontSize: 11, textAlign: "center", marginTop: 12 }}>
            Requires microphone access · ~5 minutes
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ color: "var(--color-red)", fontSize: 13, marginTop: 16 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Footer tags */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 32 }}>
          {["Real-time voice", "AI-powered", "Live visuals"].map((tag) => (
            <span key={tag} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 99,
              background: "var(--color-bg-2)", border: "1px solid var(--color-line)",
              fontSize: 11, fontWeight: 500, color: "var(--color-fg-2)",
            }}>{tag}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
