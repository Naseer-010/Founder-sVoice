/**
 * ConnectionScreen.jsx — Pre-call landing. Clean editorial layout.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConnectionScreen({ onConnect, isConnecting, error }) {
  const [name, setName] = useState("");

  const handleConnect = () => onConnect(name || undefined);

  return (
    <div className="h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md text-center"
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">Maneuver</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-semibold tracking-tight leading-tight mb-3">
          Talk to our founder
        </h1>
        <p className="text-fg-2 text-base leading-relaxed mb-10 max-w-sm mx-auto">
          Have a real voice conversation with Alex. Share what you're building,
          ask questions, and see if we're a fit.
        </p>

        {/* Card */}
        <div className="surface-1 p-6 text-left">
          <label className="block text-xs font-medium text-fg-3 uppercase tracking-wider mb-2">
            Your name
          </label>
          <input
            id="visitor-name-input"
            type="text"
            placeholder="Optional"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            disabled={isConnecting}
            className="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3 focus:outline-none focus:border-border-focus transition-colors mb-5"
          />

          <button
            id="start-conversation-btn"
            onClick={handleConnect}
            disabled={isConnecting}
            className="btn btn-accent w-full"
          >
            {isConnecting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" style={{ animation: "spin-slow 0.8s linear infinite" }} />
                Connecting…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
                Start conversation
              </>
            )}
          </button>

          <p className="text-fg-3 text-[11px] mt-3 text-center">
            Requires microphone access · Takes about 5 minutes
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-red text-sm surface-1 px-4 py-2.5 inline-block"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Footer tags */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {["Real-time voice", "AI-powered", "Live visuals"].map((tag) => (
            <span key={tag} className="pill">{tag}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
