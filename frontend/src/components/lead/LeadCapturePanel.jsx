import { motion, AnimatePresence } from "framer-motion";

const LABELS = {
  name: "Name", company: "Company", role: "Role", email: "Email",
  problem: "Problem", timeline: "Timeline", budget: "Budget", notes: "Notes",
};

export default function LeadCapturePanel({ fields }) {
  const entries = Object.entries(fields || {});

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--color-line)", flexShrink: 0 }}>
        <span className="label">Discovery</span>
        <p style={{ fontSize: 11, color: "var(--color-fg-3)", marginTop: 2 }}>Captured as you speak</p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {entries.length === 0 ? (
          <p style={{ color: "var(--color-fg-3)", fontSize: 12, textAlign: "center", marginTop: 32, fontStyle: "italic" }}>
            Waiting for details…
          </p>
        ) : (
          <AnimatePresence>
            {entries.map(([key, value]) => (
              <motion.div key={key}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ padding: 12, borderRadius: 10, background: "var(--color-bg-2)", border: "1px solid var(--color-line)" }}>
                <span className="label" style={{ display: "block", marginBottom: 4 }}>
                  {LABELS[key] || key}
                </span>
                <p style={{ fontSize: 13, lineHeight: 1.5, wordBreak: "break-word" }}>{value}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
