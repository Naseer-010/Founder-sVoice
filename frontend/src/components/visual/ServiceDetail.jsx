import { motion } from "framer-motion";

export default function ServiceDetail({ data }) {
  if (!data) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ height: "100%", overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{data.name}</div>
        <div style={{ fontSize: 13, color: "var(--color-fg-2)", lineHeight: 1.6 }}>{data.description}</div>
      </div>
      {data.includes && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="label">Includes</span>
          {data.includes.map((item, i) => (
            <motion.div key={item} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "var(--color-bg-2)", border: "1px solid var(--color-line)", fontSize: 13 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--color-accent)", flexShrink: 0 }} />
              {item}
            </motion.div>
          ))}
        </div>
      )}
      {data.timeline && <div style={{ fontSize: 12, color: "var(--color-fg-3)", marginTop: 4 }}>⏱ {data.timeline}</div>}
    </motion.div>
  );
}
