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
      className="h-full flex flex-col items-center justify-center text-center px-6"
    >
      <p className="text-fg-2 text-sm max-w-xs leading-relaxed">
        Ask about our services, process, or past work —
        visuals will appear here as we talk.
      </p>
    </motion.div>
  );
}
