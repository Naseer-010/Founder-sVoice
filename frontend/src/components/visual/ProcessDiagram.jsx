/**
 * ProcessDiagram.jsx — Visualizes Maneuver's engagement process as a step timeline.
 *
 * Triggered by the agent's show_process_diagram tool call.
 * Steps animate in sequentially with connecting lines.
 */

import { motion } from "framer-motion";

const stepColors = [
  { bg: "bg-cyan-500/20", border: "border-cyan-500/30", text: "text-cyan-400", dot: "bg-cyan-400" },
  { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400" },
  { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
  { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-400", dot: "bg-amber-400" },
  { bg: "bg-rose-500/20", border: "border-rose-500/30", text: "text-rose-400", dot: "bg-rose-400" },
];

export default function ProcessDiagram({ data }) {
  const steps = data?.steps || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="visual-scroll flex flex-col px-4 py-4"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold gradient-text mb-5"
      >
        How We Work
      </motion.h3>

      <div className="flex-1 flex flex-col gap-1">
        {steps.map((step, index) => {
          const colors = stepColors[index % stepColors.length];
          const isLast = index === steps.length - 1;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.12,
                type: "spring",
                stiffness: 180,
                damping: 18,
              }}
              className="flex items-start gap-4"
            >
              {/* Timeline connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.12 + 0.1, type: "spring" }}
                  className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center`}
                >
                  <span className={`text-xs font-bold ${colors.text}`}>
                    {step.number}
                  </span>
                </motion.div>
                {!isLast && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.12 + 0.2, duration: 0.3 }}
                    className="w-px h-6 bg-border-glass origin-top"
                  />
                )}
              </div>

              {/* Step content */}
              <div className="pb-3 flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-text-primary mb-0.5">
                  {step.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
