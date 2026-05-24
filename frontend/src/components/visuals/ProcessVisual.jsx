export default function ProcessVisual({ data }) {
  const steps = data?.steps || [];
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 4 }}>
      <span className="label" style={{ marginBottom: 8 }}>How we work</span>
      {steps.map((step, i) => (
        <div key={step.number} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          {/* Timeline */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--color-line)", background: "var(--color-bg-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--color-accent)" }}>
              {step.number}
            </div>
            {i < steps.length - 1 && <div style={{ width: 1, height: 20, background: "var(--color-line)" }} />}
          </div>
          {/* Content */}
          <div style={{ paddingBottom: 8, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{step.title}</div>
            <div style={{ fontSize: 12, color: "var(--color-fg-2)", lineHeight: 1.5, marginTop: 2 }}>{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
