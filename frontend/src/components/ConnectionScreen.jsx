/**
 * ConnectionScreen.jsx — Landing page. Pure flexbox, minimal.
 */
import { useState } from "react";

export default function ConnectionScreen({ onConnect, isConnecting, error }) {
  const [name, setName] = useState("");

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
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

        {error && (
          <p style={{ color: "var(--color-red)", fontSize: 13, marginTop: 16 }}>{error}</p>
        )}
      </div>
    </div>
  );
}
