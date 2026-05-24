/**
 * ProcessDiagram.jsx — Step timeline for Maneuver's process.
 */
import { motion } from "framer-motion";

export default function ProcessDiagram({ data }) {
  const steps = data?.steps || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col p-5 overflow-y-auto"
    >
      <h3 className="text-xs font-medium text-fg-3 uppercase tracking-wider mb-5">
        How we work
      </h3>

      <div className="space-y-0">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-4"
          >
            {/* Timeline */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center bg-surface-2">
                <span className="text-[11px] font-semibold text-accent">{step.number}</span>
              </div>
              {i < steps.length - 1 && <div className="w-px h-6 bg-border" />}
            </div>

            {/* Content */}
            <div className="pb-4 -mt-0.5">
              <h4 className="text-sm font-medium text-fg">{step.title}</h4>
              <p className="text-xs text-fg-2 leading-relaxed mt-0.5">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
