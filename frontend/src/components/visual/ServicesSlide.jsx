/**
 * ServicesSlide.jsx — Services overview as a clean list.
 */
import { motion } from "framer-motion";

export default function ServicesSlide({ data }) {
  const services = data?.services || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col p-5 overflow-y-auto"
    >
      <h3 className="text-xs font-medium text-fg-3 uppercase tracking-wider mb-4">
        Our services
      </h3>

      <div className="space-y-2">
        {services.map((service, i) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="surface-2 p-4"
          >
            <h4 className="text-sm font-medium text-fg mb-1">{service.name}</h4>
            <p className="text-xs text-fg-2 leading-relaxed">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
