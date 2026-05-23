/**
 * ServicesSlide.jsx — Displays Maneuver's services as animated cards.
 *
 * Triggered by the agent's show_services_slide tool call.
 * Cards animate in with staggered spring animations.
 */

import { motion } from "framer-motion";

const iconMap = {
  strategy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
      <path d="M8 12h8" />
    </svg>
  ),
  design: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  engineering: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  ai: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
      <path d="M6 13v1a6 6 0 0 0 12 0v-1" />
      <line x1="12" y1="20" x2="12" y2="22" />
    </svg>
  ),
  growth: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

const gradients = [
  "from-cyan-500/20 to-cyan-500/5",
  "from-purple-500/20 to-purple-500/5",
  "from-emerald-500/20 to-emerald-500/5",
  "from-amber-500/20 to-amber-500/5",
  "from-rose-500/20 to-rose-500/5",
];

const borderColors = [
  "border-cyan-500/20",
  "border-purple-500/20",
  "border-emerald-500/20",
  "border-amber-500/20",
  "border-rose-500/20",
];

const textColors = [
  "text-cyan-400",
  "text-purple-400",
  "text-emerald-400",
  "text-amber-400",
  "text-rose-400",
];

export default function ServicesSlide({ data }) {
  const services = data?.services || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full overflow-y-auto flex flex-col px-4 py-4"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold gradient-text mb-4"
      >
        Our Services
      </motion.h3>

      <div className="flex-1 grid gap-3 auto-rows-min">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className={`rounded-lg p-4 bg-gradient-to-r ${gradients[index % gradients.length]} border ${borderColors[index % borderColors.length]} hover:bg-bg-glass-hover transition-all cursor-default`}
          >
            <div className="flex items-start gap-3">
              <div className={`${textColors[index % textColors.length]} mt-0.5`}>
                {iconMap[service.icon] || iconMap.engineering}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-text-primary mb-1">
                  {service.name}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
