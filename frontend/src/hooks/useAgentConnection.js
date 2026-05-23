/**
 * useAgentConnection.js — Manages the LiveKit room connection lifecycle.
 *
 * Handles: token fetching → room connection → cleanup.
 * Returns connection state and room metadata for the UI.
 */

import { useState, useCallback, useRef } from "react";
import { fetchToken } from "../services/tokenService";

/**
 * Connection states for the UI
 * @typedef {"idle" | "connecting" | "connected" | "error"} ConnectionState
 */

export function useAgentConnection() {
  const [connectionState, setConnectionState] = useState("idle");
  const [connectionData, setConnectionData] = useState(null);
  const [error, setError] = useState(null);
  const connectAttemptRef = useRef(0);

  const connect = useCallback(async (participantName) => {
    const attempt = ++connectAttemptRef.current;

    try {
      setConnectionState("connecting");
      setError(null);

      const data = await fetchToken(undefined, participantName);

      // Stale check — user might have disconnected while waiting
      if (attempt !== connectAttemptRef.current) return;

      setConnectionData(data);
      setConnectionState("connected");
    } catch (err) {
      if (attempt !== connectAttemptRef.current) return;

      console.error("Connection failed:", err);
      setError(err.message || "Unable to connect to the voice agent.");
      setConnectionState("error");
    }
  }, []);

  const disconnect = useCallback(() => {
    connectAttemptRef.current++;
    setConnectionData(null);
    setConnectionState("idle");
    setError(null);
  }, []);

  return {
    connectionState,
    connectionData,
    error,
    connect,
    disconnect,
  };
}
