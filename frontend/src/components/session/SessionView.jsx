/**
 * SessionView.jsx — Main conversation layout.
 *
 * Orchestrates the 3-panel UI: Transcript | Agent Orb & Visuals | Lead Capture.
 * Connects all the custom hooks and LiveKit context.
 */

import { useState, useCallback, useEffect } from "react";
import { useRoomContext, useLocalParticipant } from "@livekit/components-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAgentState } from "../../hooks/useAgentState";
import { useRpcHandler } from "../../hooks/useRpcHandler";
import { useBrowserTTS } from "../../hooks/useBrowserTTS";
import { VISUAL_TYPES } from "../../utils/constants";

import AgentOrb from "./AgentOrb";
import VisualLayer from "../visual/VisualLayer";
import TranscriptPanel from "../transcript/TranscriptPanel";
import LeadCapturePanel from "../lead/LeadCapturePanel";

export default function SessionView({ onDisconnect }) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const { agentState, agentName } = useAgentState(room);
  
  const [currentVisual, setCurrentVisual] = useState({ type: VISUAL_TYPES.WELCOME, data: null });
  const [capturedFields, setCapturedFields] = useState({});
  const [isEnding, setIsEnding] = useState(false);

  // We are using browser TTS for the agent's voice because the backend doesn't have a TTS plugin configured.
  // The agent sends transcription text over the data channel, and we synthesize it locally.
  const { speak, stop } = useBrowserTTS();

  // Handle TTS: Listen for agent transcription to speak it
  useEffect(() => {
    if (!room) return;
    
    const handleTranscription = (segments, participant) => {
      // Only speak the agent's text
      if (participant.identity.includes("agent") || participant.name === agentName) {
        segments.forEach(segment => {
          if (segment.final && segment.text.trim()) {
            speak(segment.text);
          }
        });
      }
    };
    
    room.on("transcriptionReceived", handleTranscription);
    return () => room.off("transcriptionReceived", handleTranscription);
  }, [room, agentName, speak]);

  // Handle interruption: Stop speaking if user starts talking
  useEffect(() => {
    if (!room) return;
    
    const handleActiveSpeakers = (speakers) => {
      const isUserSpeaking = speakers.some(p => p.identity === localParticipant?.identity);
      if (isUserSpeaking) {
        stop(); // Cancel current TTS if user interrupts
      }
    };
    
    room.on("activeSpeakersChanged", handleActiveSpeakers);
    return () => room.off("activeSpeakersChanged", handleActiveSpeakers);
  }, [room, localParticipant, stop]);


  // Register RPC callbacks
  const rpcCallbacks = {
    onVisualUpdate: useCallback((payload) => {
      setCurrentVisual(payload);
    }, []),
    
    onLeadUpdate: useCallback((payload) => {
      setCapturedFields(payload.all_fields);
    }, []),
    
    onCallEnded: useCallback((payload) => {
      setIsEnding(true);
      // Wait a bit to let the user see the final state, then disconnect
      setTimeout(() => {
        onDisconnect();
      }, 5000);
    }, [onDisconnect])
  };

  useRpcHandler(localParticipant, rpcCallbacks);

  return (
    <div className="session-page">
      {/* Header */}
      <header className="session-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-lg">Maneuver</span>
        </div>
        
        <button 
          onClick={onDisconnect}
          className="px-4 py-2 rounded-lg border border-accent-rose/30 text-accent-rose text-sm font-medium hover:bg-accent-rose/10 transition-colors"
        >
          End Call
        </button>
      </header>

      <main className="session-grid">
        
        {/* Left Column: Transcript */}
        <section className="session-panel">
          <TranscriptPanel room={room} agentName={agentName} />
        </section>

        {/* Center Column: Visual Layer & Agent Orb */}
        <section className="session-stage">
          {/* Visual Canvas */}
          <div className="min-h-0 relative">
            <VisualLayer currentVisual={currentVisual} />
            
            <AnimatePresence>
              {isEnding && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-50 bg-bg-primary/80 backdrop-blur-md rounded-lg flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="w-16 h-16 rounded-full bg-accent-emerald/20 flex items-center justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-emerald">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Call Completed</h2>
                  <p className="text-text-secondary">Saving discovery data...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Agent Orb & Audio Controls */}
          <div className="min-h-0 glass rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
            <AgentOrb state={agentState} size={112} />
            
            {/* Simple audio visualizer for local mic could go here */}
          </div>
        </section>

        {/* Right Column: Lead Capture */}
        <section className="session-panel">
          <LeadCapturePanel capturedFields={capturedFields} />
        </section>
        
      </main>
    </div>
  );
}
