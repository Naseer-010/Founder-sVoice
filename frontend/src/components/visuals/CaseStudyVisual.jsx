export default function CaseStudyVisual({ data }) {
  if (!data) return null;
  const rows = [
    { label: "Challenge", value: data.challenge },
    { label: "Solution", value: data.solution },
    { label: "Result", value: data.result },
  ];
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <span className="label">Case study</span>
        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{data.name}</div>
        <div style={{
          display: "inline-block", marginTop: 6, padding: "3px 10px", borderRadius: 99,
          background: "var(--color-bg-2)", border: "1px solid var(--color-line)",
          fontSize: 11, fontWeight: 500, color: "var(--color-fg-2)",
        }}>{data.industry}</div>
      </div>
      {rows.map((r) => (
        <div key={r.label} style={{ padding: 12, borderRadius: 10, background: "var(--color-bg-2)", border: "1px solid var(--color-line)" }}>
          <span className="label" style={{ display: "block", marginBottom: 4 }}>{r.label}</span>
          <p style={{ fontSize: 13, lineHeight: 1.5 }}>{r.value}</p>
        </div>
      ))}
      {data.timeline && <p style={{ fontSize: 12, color: "var(--color-fg-3)" }}>Delivered in {data.timeline}</p>}
    </div>
  );
}
