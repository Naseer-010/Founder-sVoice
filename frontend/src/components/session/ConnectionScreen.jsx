/**
 * ConnectionScreen.jsx — Pre-call landing page with CTA to start conversation.
 *
 * Premium dark UI with animated gradient, mic permission prompt, and
 * a strong "Talk to Our Founder" call-to-action.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConnectionScreen({ onConnect, isConnecting, error }) {
  const [name, setName] = useState("");

  const handleConnect = () => {
    onConnect(name || undefined);
  };

  return (
    <div className="min-h-full flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-lg w-full text-center py-8"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">
              Maneuver
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight"
        >
          Talk to Our{" "}
          <span className="gradient-text">Founder</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-text-secondary text-base sm:text-lg mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed"
        >
          Have a real conversation with Alex, Maneuver's founder.
          Share your vision, ask questions, and discover how we can help build your product.
        </motion.p>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-strong p-5 sm:p-8 max-w-sm mx-auto"
        >
          {/* Name Input (Optional) */}
          <div className="mb-6">
            <input
              id="visitor-name-input"
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              className="w-full bg-bg-glass border border-border-glass rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-glass-active transition-colors text-center"
              disabled={isConnecting}
            />
          </div>

          {/* Connect Button */}
          <button
            id="start-conversation-btn"
            onClick={handleConnect}
            disabled={isConnecting}
            className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isConnecting ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Connecting...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                Start Conversation
              </>
            )}
          </button>

          <p className="text-text-muted text-xs mt-4">
            Requires microphone access · ~5 min call
          </p>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 glass px-4 py-3 text-accent-rose text-sm max-w-sm mx-auto"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-text-muted text-xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-emerald" />
            Real-time voice
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-cyan" />
            AI-powered
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-purple" />
            Interactive visuals
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
