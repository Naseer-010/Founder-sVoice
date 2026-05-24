/**
 * SessionView.jsx — Main conversation layout.
 * Clean 3-column grid: Transcript | Visuals+Orb | Lead Capture.
 */

import { useState, useCallback, useEffect } from "react";
import { useRoomContext, useLocalParticipant } from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";

import { useAgentState } from "../../hooks/useAgentState";
import { useRpcHandler } from "../../hooks/useRpcHandler";
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

  // RPC callbacks — agent tool calls update these states
  const rpcCallbacks = {
    onVisualUpdate: useCallback((payload) => setCurrentVisual(payload), []),
    onLeadUpdate: useCallback((payload) => setCapturedFields(payload.all_fields || {}), []),
    onCallEnded: useCallback(() => {
      setIsEnding(true);
      setTimeout(() => onDisconnect(), 4000);
    }, [onDisconnect]),
  };

  useRpcHandler(localParticipant, rpcCallbacks);

  return (
    <div className="session-shell">
      {/* Top bar */}
      <header className="session-topbar">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight">Maneuver</span>
          <span className="pill ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            Live
          </span>
        </div>

        <button onClick={onDisconnect} className="btn btn-ghost text-red text-xs">
          End call
        </button>
      </header>

      {/* Main grid */}
      <main className="session-main">
        {/* Left — Transcript */}
        <div className="session-side">
          <TranscriptPanel room={room} agentName={agentName} />
        </div>

        {/* Center — Visuals + Orb */}
        <div className="session-center">
          <div className="flex-[3] min-h-0 relative overflow-hidden">
            <VisualLayer currentVisual={currentVisual} />

            <AnimatePresence>
              {isEnding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-50 bg-surface-0/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green mb-3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="font-semibold text-lg">Call complete</p>
                  <p className="text-fg-3 text-sm mt-1">Discovery data saved</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-[2] min-h-0 surface-1 flex items-center justify-center overflow-hidden">
            <AgentOrb state={agentState} size={100} />
          </div>
        </div>

        {/* Right — Lead Capture */}
        <div className="session-side">
          <LeadCapturePanel capturedFields={capturedFields} />
        </div>
      </main>
    </div>
  );
}
