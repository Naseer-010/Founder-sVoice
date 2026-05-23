/**
 * WelcomeVisual.jsx — Default/idle visual displayed before any tool calls.
 *
 * Shows a welcoming message with the Maneuver brand and subtle animation.
 */

import { motion } from "framer-motion";

export default function WelcomeVisual() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-full flex-col items-center justify-center text-center px-6 py-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center mb-6"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold mb-2 text-text-primary"
      >
        Welcome to Maneuver
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-text-secondary text-sm max-w-xs leading-relaxed"
      >
        Ask about our services, process, or past work — the visual content
        will appear here as we chat.
      </motion.p>
    </motion.div>
  );
}
