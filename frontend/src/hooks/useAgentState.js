/**
 * useAgentState.js — Tracks the AI agent's current state from LiveKit participant attributes.
 *
 * Maps the agent's state machine (initializing → listening → thinking → speaking)
 * to React state for the UI to consume.
 */

import { useState, useEffect, useCallback } from "react";
import { AGENT_STATES } from "../utils/constants";

/**
 * Track agent state from a LiveKit room.
 *
 * @param {import("livekit-client").Room | null} room
 * @returns {{ agentState: string, agentName: string | null }}
 */
export function useAgentState(room) {
  const [agentState, setAgentState] = useState(AGENT_STATES.INITIALIZING);
  const [agentName, setAgentName] = useState(null);

  const handleParticipantUpdate = useCallback(() => {
    if (!room) return;

    // Find the agent participant (has isAgent metadata or "agent" in identity)
    for (const [, participant] of room.remoteParticipants) {
      const attrs = participant.attributes || {};

      // LiveKit agents set lk.agent.state attribute
      if (attrs["lk.agent.state"]) {
        setAgentState(attrs["lk.agent.state"]);
        setAgentName(participant.name || participant.identity);
        return;
      }

      // Fallback: check if identity contains "agent"
      if (participant.identity?.includes("agent")) {
        setAgentName(participant.name || participant.identity);
      }
    }
  }, [room]);

  useEffect(() => {
    if (!room) return;

    // Listen for participant attribute changes
    room.on("participantAttributesChanged", handleParticipantUpdate);
    room.on("participantConnected", handleParticipantUpdate);
    room.on("participantDisconnected", handleParticipantUpdate);

    // Check initial state
    handleParticipantUpdate();

    return () => {
      room.off("participantAttributesChanged", handleParticipantUpdate);
      room.off("participantConnected", handleParticipantUpdate);
      room.off("participantDisconnected", handleParticipantUpdate);
    };
  }, [room, handleParticipantUpdate]);

  return { agentState, agentName };
}
