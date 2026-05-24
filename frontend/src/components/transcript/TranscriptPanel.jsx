/**
 * TranscriptPanel.jsx — Live conversation transcript.
 * Clean monochrome bubbles, auto-scroll.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TranscriptPanel({ room, agentName }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!room) return;

    const handleTranscription = (segments, participant) => {
      setMessages((prev) => {
        const updated = [...prev];
        const isAgent = participant.identity?.includes("agent") || participant.name === agentName;

        segments.forEach((segment) => {
          const msgId = `${participant.identity}-${segment.id}`;
          const idx = updated.findIndex((m) => m.id === msgId);
          const msg = {
            id: msgId,
            text: segment.text,
            isAgent,
            isFinal: segment.final,
            timestamp: Date.now(),
          };
          if (idx >= 0) updated[idx] = msg;
          else updated.push(msg);
        });

        return updated.slice(-50);
      });
    };

    room.on("transcriptionReceived", handleTranscription);
    return () => room.off("transcriptionReceived", handleTranscription);
  }, [room, agentName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="surface-1 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-medium text-fg-2 uppercase tracking-wider">Transcript</span>
        <span className="pill text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-green" />
          Live
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-fg-3 text-xs text-center mt-8 italic">
            Conversation will appear here…
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: msg.isFinal ? 1 : 0.5, y: 0 }}
                layout
                className={`max-w-[90%] ${msg.isAgent ? "" : "ml-auto text-right"}`}
              >
                <span className="text-[10px] font-medium text-fg-3 mb-1 block">
                  {msg.isAgent ? "Alex" : "You"}
                </span>
                <div className={`inline-block text-left px-3 py-2 rounded-lg text-sm leading-relaxed ${
                  msg.isAgent
                    ? "bg-surface-2 text-fg border border-border"
                    : "bg-accent/15 text-fg border border-accent/20"
                }`}>
                  {msg.text}
                  {!msg.isFinal && (
                    <span className="inline-block w-1 h-3 bg-fg-3 rounded-full ml-1 animate-pulse" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
