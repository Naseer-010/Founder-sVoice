/**
 * SessionView.jsx — Main conversation layout.
 * 
 * State flow visible in UI:
 *   initializing → listening → thinking (analyzing) → speaking → listening → ...
 * 
 * TTS: When TTS_MODE=browser, agent text arrives as transcription events.
 *       This component speaks them via useBrowserTTS and reflects the
 *       speaking state in the orb.
 * 
 * Interruptions: When user starts talking, browser TTS is cancelled
 *       immediately and the orb switches back to listening.
 */
import { useState, useCallback, useEffect, useRef } from "react";
import { useRoomContext, useLocalParticipant } from "@livekit/components-react";

import { useAgentState } from "../hooks/useAgentState";
import { useRpcHandler } from "../hooks/useRpcHandler";
import { useBrowserTTS } from "../hooks/useBrowserTTS";

import AgentOrb from "./AgentOrb";
import VisualLayer from "./VisualLayer";
import TranscriptPanel from "./TranscriptPanel";
import LeadPanel from "./LeadPanel";

export default function SessionView({ onDisconnect }) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const { agentState, agentName } = useAgentState(room);

  const [visual, setVisual] = useState({ type: "welcome", data: null });
  const [leadFields, setLeadFields] = useState({});

  // Browser TTS for agent speech
  const { speak, stop: stopTTS, isSpeaking } = useBrowserTTS();

  // Track if we should use browser TTS (no server audio track detected)
  const hasServerAudioRef = useRef(false);

  // Detect if the agent publishes an audio track → means server TTS is active
  useEffect(() => {
    if (!room) return;
    const check = () => {
      for (const [, p] of room.remoteParticipants) {
        if (p.audioTrackPublications.size > 0) {
          hasServerAudioRef.current = true;
          return;
        }
      }
    };
    room.on("trackSubscribed", check);
    check();
    return () => room.off("trackSubscribed", check);
  }, [room]);

  // Listen for agent transcription → speak via browser TTS
  useEffect(() => {
    if (!room) return;

    const handleTranscription = (segments, participant) => {
      // Skip if server TTS is handling audio
      if (hasServerAudioRef.current) return;

      const isAgent =
        participant?.identity?.includes("agent") ||
        participant?.name === agentName;
      if (!isAgent) return;

      segments.forEach((seg) => {
        if (seg.final && seg.text?.trim()) {
          speak(seg.text);
        }
      });
    };

    room.on("transcriptionReceived", handleTranscription);
    return () => room.off("transcriptionReceived", handleTranscription);
  }, [room, agentName, speak]);

  // Interruption: stop browser TTS when user starts speaking
  useEffect(() => {
    if (!room) return;

    const handleSpeakers = (speakers) => {
      const userSpeaking = speakers.some(
        (s) => s.identity === localParticipant?.identity
      );
      if (userSpeaking && isSpeaking) {
        stopTTS(); // Immediately cancel speech
      }
    };

    room.on("activeSpeakersChanged", handleSpeakers);
    return () => room.off("activeSpeakersChanged", handleSpeakers);
  }, [room, localParticipant, isSpeaking, stopTTS]);

  // RPC callbacks
  useRpcHandler(localParticipant, {
    onVisualUpdate: useCallback((p) => setVisual(p), []),
    onLeadUpdate: useCallback((p) => setLeadFields(p.all_fields || {}), []),
    onCallEnded: useCallback(() => {
      stopTTS();
      setTimeout(() => onDisconnect(), 3000);
    }, [onDisconnect, stopTTS]),
  });

  // Compute display state: prefer browser TTS speaking state over server agent state
  const displayState = isSpeaking ? "speaking" : agentState;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", padding: 12, gap: 12, overflow: "hidden" }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Maneuver</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, background: "var(--color-bg-2)", border: "1px solid var(--color-line)", fontSize: 10, color: "var(--color-fg-3)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-green)" }} />
            Live
          </span>
        </div>
        <button onClick={() => { stopTTS(); onDisconnect(); }} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--color-line)", background: "transparent", color: "var(--color-red)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
          End call
        </button>
      </div>

      {/* ── Main content — 3 columns ── */}
      <div style={{ flex: 1, display: "flex", gap: 12, minHeight: 0 }}>

        {/* Left — Transcript */}
        <div style={{ width: 280, flexShrink: 0, minHeight: 0 }}>
          <TranscriptPanel room={room} agentName={agentName} />
        </div>

        {/* Center — Visual + Orb stacked */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minHeight: 0 }}>
          <div style={{ flex: 5, minHeight: 0 }}>
            <VisualLayer visual={visual} />
          </div>
          <div className="card" style={{ flex: 3, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AgentOrb state={displayState} />
          </div>
        </div>

        {/* Right — Lead capture */}
        <div style={{ width: 280, flexShrink: 0, minHeight: 0 }}>
          <LeadPanel fields={leadFields} />
        </div>
      </div>
    </div>
  );
}
