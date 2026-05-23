/**
 * TranscriptPanel.jsx — Live transcription display.
 *
 * Subscribes to the LiveKit room's transcription events and displays
 * user and agent speech bubbles with a scrolling container.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TranscriptPanel({ room, agentName }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!room) return;

    const handleTranscription = (segments, participant, publication) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        
        segments.forEach((segment) => {
          // Find if we already have an active message for this participant
          const isAgent = participant.identity.includes("agent") || participant.name === agentName;
          const msgId = `${participant.identity}-${segment.id}`;
          
          const existingIdx = newMessages.findIndex((m) => m.id === msgId);
          
          const msg = {
            id: msgId,
            text: segment.text,
            isAgent,
            name: isAgent ? "Alex" : "You",
            isFinal: segment.final,
            timestamp: Date.now(),
          };

          if (existingIdx >= 0) {
            newMessages[existingIdx] = msg;
          } else {
            newMessages.push(msg);
          }
        });

        // Keep last 50 messages to prevent memory issues
        return newMessages.slice(-50);
      });
    };

    room.on("transcriptionReceived", handleTranscription);
    return () => room.off("transcriptionReceived", handleTranscription);
  }, [room, agentName]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-bg-glass backdrop-blur-xl rounded-lg border border-border-glass overflow-hidden">
      <div className="px-5 py-4 border-b border-border-glass flex items-center justify-between bg-bg-secondary/50">
        <h3 className="text-sm font-semibold text-text-primary tracking-wide">Live Transcript</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
          <span className="text-xs text-text-muted">Recording</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth"
      >
        {messages.length === 0 ? (
            <div className="min-h-48 h-full flex items-center justify-center text-text-muted text-sm italic text-center px-4">
            Conversation will appear here...
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: msg.isFinal ? 1 : 0.7, y: 0, scale: 1 }}
                layout
                className={`flex flex-col max-w-[85%] ${msg.isAgent ? "self-start" : "self-end ml-auto"}`}
              >
                <span className={`text-[10px] font-medium mb-1 ${msg.isAgent ? "text-accent-cyan ml-1" : "text-accent-purple text-right mr-1"}`}>
                  {msg.name}
                </span>
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.isAgent 
                      ? "bg-bg-glass border border-border-glass text-text-primary rounded-tl-sm" 
                      : "bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 border border-accent-purple/30 text-white rounded-tr-sm"
                  }`}
                >
                  {msg.text}
                  {!msg.isFinal && (
                    <span className="inline-flex ml-1 w-1 h-3 bg-text-muted rounded-full animate-pulse" />
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
