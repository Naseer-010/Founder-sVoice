/**
 * ServicesSlide.jsx — Services overview as a clean list with staggered entry.
 */
import { motion } from "framer-motion";

export default function ServicesSlide({ data }) {
  const services = data?.services || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: "100%", overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 8 }}
    >
      <span className="label" style={{ marginBottom: 4 }}>Our services</span>
      {services.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          style={{ padding: 14, borderRadius: 10, background: "var(--color-bg-2)", border: "1px solid var(--color-line)" }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{s.name}</div>
          <div style={{ fontSize: 12, color: "var(--color-fg-2)", lineHeight: 1.5 }}>{s.description}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
