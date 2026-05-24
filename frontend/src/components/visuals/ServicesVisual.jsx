export default function ServicesVisual({ data }) {
  const services = data?.services || [];
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="label" style={{ marginBottom: 4 }}>Our services</span>
      {services.map((s) => (
        <div key={s.name} style={{ padding: 14, borderRadius: 10, background: "var(--color-bg-2)", border: "1px solid var(--color-line)" }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{s.name}</div>
          <div style={{ fontSize: 12, color: "var(--color-fg-2)", lineHeight: 1.5 }}>{s.description}</div>
        </div>
      ))}
    </div>
  );
}
