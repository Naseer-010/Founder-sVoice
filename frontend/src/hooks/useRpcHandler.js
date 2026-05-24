/**
 * useRpcHandler.js — Registers RPC methods on the LiveKit local participant
 * to receive tool calls from the agent and update React state.
 *
 * Design: Maps agent RPC method names → React state setters.
 * When the agent calls a tool (e.g., show_services_slide), the LiveKit
 * framework routes the RPC to this handler, which updates the visual layer.
 *
 * Key fix: Uses a registration guard + try/catch to handle React StrictMode's
 * double-mount and prevents "already registered" crashes.
 */

import { useEffect, useRef } from "react";

const RPC_METHODS = ["show_visual", "update_lead", "call_ended"];

/**
 * Safely register a single RPC method, unregistering first if it already exists.
 *
 * @param {import("livekit-client").LocalParticipant} participant
 * @param {string} method
 * @param {function} handler
 */
function safeRegisterRpc(participant, method, handler) {
  try {
    participant.unregisterRpcMethod(method);
  } catch {
    // Method wasn't registered yet — that's fine
  }
  participant.registerRpcMethod(method, handler);
}

/**
 * Register RPC handlers on a LiveKit local participant.
 *
 * @param {import("livekit-client").LocalParticipant | null} localParticipant
 * @param {Object} callbacks — State update callbacks
 * @param {function} callbacks.onVisualUpdate — Called with visual payload
 * @param {function} callbacks.onLeadUpdate — Called with lead field update
 * @param {function} callbacks.onCallEnded — Called when call ends
 */
export function useRpcHandler(localParticipant, callbacks) {
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!localParticipant) return;

    // Register: show_visual — handles all visual layer updates
    safeRegisterRpc(localParticipant, "show_visual", async (data) => {
      try {
        const payload = JSON.parse(data.payload);
        callbacksRef.current.onVisualUpdate?.(payload);
        return JSON.stringify({ status: "ok" });
      } catch (err) {
        console.error("RPC show_visual error:", err);
        return JSON.stringify({ status: "error", message: err.message });
      }
    });

    // Register: update_lead — handles lead field captures
    safeRegisterRpc(localParticipant, "update_lead", async (data) => {
      try {
        const payload = JSON.parse(data.payload);
        callbacksRef.current.onLeadUpdate?.(payload);
        return JSON.stringify({ status: "ok" });
      } catch (err) {
        console.error("RPC update_lead error:", err);
        return JSON.stringify({ status: "error", message: err.message });
      }
    });

    // Register: call_ended — handles call completion
    safeRegisterRpc(localParticipant, "call_ended", async (data) => {
      try {
        const payload = JSON.parse(data.payload);
        callbacksRef.current.onCallEnded?.(payload);
        return JSON.stringify({ status: "ok" });
      } catch (err) {
        console.error("RPC call_ended error:", err);
        return JSON.stringify({ status: "error", message: err.message });
      }
    });

    console.log("[RPC] Handlers registered on", localParticipant.identity);

    // Cleanup: unregister all methods when effect tears down
    return () => {
      RPC_METHODS.forEach((method) => {
        try {
          localParticipant.unregisterRpcMethod(method);
        } catch {
          // Already cleaned up
        }
      });
      console.log("[RPC] Handlers unregistered");
    };
  }, [localParticipant]);
}
