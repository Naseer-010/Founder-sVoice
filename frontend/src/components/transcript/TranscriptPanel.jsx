import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TranscriptPanel({ room, agentName }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!room) return;
    const handle = (segments, participant) => {
      setMessages((prev) => {
        const updated = [...prev];
        const isAgent = participant.identity?.includes("agent") || participant.name === agentName;
        segments.forEach((seg) => {
          const id = `${participant.identity}-${seg.id}`;
          const idx = updated.findIndex((m) => m.id === id);
          const msg = { id, text: seg.text, isAgent, isFinal: seg.final };
          if (idx >= 0) updated[idx] = msg; else updated.push(msg);
        });
        return updated.slice(-50);
      });
    };
    room.on("transcriptionReceived", handle);
    return () => room.off("transcriptionReceived", handle);
  }, [room, agentName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--color-line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span className="label">Transcript</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: "var(--color-fg-3)" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-green)" }} />
          Live
        </span>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 ? (
          <p style={{ color: "var(--color-fg-3)", fontSize: 12, textAlign: "center", marginTop: 32, fontStyle: "italic" }}>
            Conversation will appear here…
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: msg.isFinal ? 1 : 0.5, y: 0 }} layout
                style={{ maxWidth: "90%", alignSelf: msg.isAgent ? "flex-start" : "flex-end" }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-fg-3)", marginBottom: 3, textAlign: msg.isAgent ? "left" : "right" }}>
                  {msg.isAgent ? "Alex" : "You"}
                </div>
                <div style={{
                  padding: "8px 12px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
                  background: msg.isAgent ? "var(--color-bg-2)" : "rgba(129,140,248,.12)",
                  border: `1px solid ${msg.isAgent ? "var(--color-line)" : "rgba(129,140,248,.2)"}`,
                }}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
