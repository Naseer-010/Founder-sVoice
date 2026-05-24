/**
 * ServiceDetail.jsx — Single service deep-dive.
 */
import { motion } from "framer-motion";

export default function ServiceDetail({ data }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col p-5 overflow-y-auto"
    >
      <h3 className="text-lg font-semibold text-fg mb-1">{data.name}</h3>
      <p className="text-sm text-fg-2 leading-relaxed mb-5">{data.description}</p>

      {data.includes && (
        <>
          <span className="text-[10px] font-medium text-fg-3 uppercase tracking-wider mb-3 block">
            Includes
          </span>
          <div className="space-y-1.5">
            {data.includes.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5 px-3 py-2 surface-2 text-sm text-fg"
              >
                <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                {item}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {data.timeline && (
        <div className="mt-4 pill self-start">
          ⏱ {data.timeline}
        </div>
      )}
    </motion.div>
  );
}
