/**
 * LeadCapturePanel.jsx — Live discovery info captured by the agent.
 * Fields animate in as the agent learns them.
 */

import { motion, AnimatePresence } from "framer-motion";

const FIELD_META = {
  name:     { label: "Name",     icon: "→" },
  company:  { label: "Company",  icon: "→" },
  role:     { label: "Role",     icon: "→" },
  email:    { label: "Email",    icon: "→" },
  problem:  { label: "Problem",  icon: "→" },
  timeline: { label: "Timeline", icon: "→" },
  budget:   { label: "Budget",   icon: "→" },
  notes:    { label: "Notes",    icon: "→" },
};

export default function LeadCapturePanel({ capturedFields }) {
  const fields = Object.entries(capturedFields || {});

  return (
    <div className="surface-1 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <span className="text-xs font-medium text-fg-2 uppercase tracking-wider">Discovery</span>
        <p className="text-[11px] text-fg-3 mt-0.5">Captured as you speak</p>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4">
        {fields.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-fg-3 text-xs italic">Waiting for details…</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {fields.map(([key, value]) => {
                const meta = FIELD_META[key] || { label: key, icon: "→" };
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="surface-2 p-3"
                  >
                    <span className="text-[10px] font-medium text-fg-3 uppercase tracking-wider block mb-1">
                      {meta.label}
                    </span>
                    <p className="text-sm text-fg leading-relaxed break-words">
                      {value}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
