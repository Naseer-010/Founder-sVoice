/**
 * CaseStudyCard.jsx — Displays a case study with metrics.
 *
 * Triggered by the agent's show_case_study tool call.
 */

import { motion } from "framer-motion";

export default function CaseStudyCard({ data }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="visual-scroll flex flex-col px-4 py-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-1"
      >
        <span className="text-xs font-medium text-accent-cyan uppercase tracking-wider">
          Case Study
        </span>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-xl font-bold text-text-primary mb-1"
      >
        {data.name}
      </motion.h3>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex self-start px-2.5 py-1 rounded-full bg-accent-purple/15 border border-accent-purple/20 mb-4"
      >
        <span className="text-xs font-medium text-accent-purple">
          {data.industry}
        </span>
      </motion.div>

      {/* Challenge → Solution → Result */}
      <div className="flex-1 space-y-3">
        {[
          { label: "Challenge", value: data.challenge, color: "text-accent-rose", bg: "bg-rose-500/10", border: "border-rose-500/15" },
          { label: "Solution", value: data.solution, color: "text-accent-cyan", bg: "bg-cyan-500/10", border: "border-cyan-500/15" },
          { label: "Result", value: data.result, color: "text-accent-emerald", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + index * 0.1 }}
            className={`p-3 rounded-lg ${item.bg} border ${item.border}`}
          >
            <span className={`text-xs font-semibold ${item.color} uppercase tracking-wider`}>
              {item.label}
            </span>
            <p className="text-sm text-text-primary mt-1 leading-relaxed">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      {data.timeline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center gap-2 text-xs text-text-muted"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Delivered in {data.timeline}
        </motion.div>
      )}
    </motion.div>
  );
}
