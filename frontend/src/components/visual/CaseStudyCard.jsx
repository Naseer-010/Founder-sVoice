/**
 * CaseStudyCard.jsx — Case study display.
 */
import { motion } from "framer-motion";

export default function CaseStudyCard({ data }) {
  if (!data) return null;

  const rows = [
    { label: "Challenge", value: data.challenge },
    { label: "Solution", value: data.solution },
    { label: "Result", value: data.result },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col p-5 overflow-y-auto"
    >
      <span className="text-[10px] font-medium text-accent uppercase tracking-wider mb-1">
        Case study
      </span>
      <h3 className="text-lg font-semibold text-fg mb-1">{data.name}</h3>
      <span className="pill self-start mb-5">{data.industry}</span>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="surface-2 p-3"
          >
            <span className="text-[10px] font-medium text-fg-3 uppercase tracking-wider block mb-1">
              {row.label}
            </span>
            <p className="text-sm text-fg leading-relaxed">{row.value}</p>
          </motion.div>
        ))}
      </div>

      {data.timeline && (
        <p className="text-xs text-fg-3 mt-4">Delivered in {data.timeline}</p>
      )}
    </motion.div>
  );
}
