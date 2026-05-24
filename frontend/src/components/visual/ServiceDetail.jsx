/**
 * ServiceDetail.jsx — Detailed view of a single Maneuver service.
 *
 * Triggered when the agent calls show_service_detail tool.
 * Shows service name, description, includes, and timeline.
 */

import { motion } from "framer-motion";

export default function ServiceDetail({ data }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="visual-scroll flex flex-col px-4 py-4"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <h3 className="text-lg font-semibold gradient-text mb-1">
          {data.name}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {data.description}
        </p>
      </motion.div>

      {/* What's Included */}
      {data.includes && (
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            What's Included
          </h4>
          <div className="space-y-2">
            {data.includes.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-glass border border-border-glass"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0" />
                <span className="text-sm text-text-primary">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Badge */}
      {data.timeline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-purple/10 border border-accent-purple/20 self-start"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-purple">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-xs font-medium text-accent-purple">
            {data.timeline}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
