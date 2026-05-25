/**
 * WelcomeVisual.jsx — Default idle state. Minimal.
 */
import { motion } from "framer-motion";

export default function WelcomeVisual() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <p style={{ color: "var(--color-fg-3)", fontSize: 13, maxWidth: 280, textAlign: "center", lineHeight: 1.6 }}>
        Ask about our services, process, or past work — visuals will appear here as we talk.
      </p>
    </motion.div>
  );
}
