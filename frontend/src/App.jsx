/**
 * App.jsx — Root Application Component
 *
 * Manages the top-level routing between the ConnectionScreen and the active SessionView.
 * Wraps the SessionView in LiveKitRoom to provide WebRTC context.
 *
 * Includes an ErrorBoundary to catch crashes in SessionView gracefully
 * instead of showing a blank white/black screen.
 */

import React from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";

import AppShell from "./components/layout/AppShell";
import ConnectionScreen from "./components/session/ConnectionScreen";
import SessionView from "./components/session/SessionView";
import { useAgentConnection } from "./hooks/useAgentConnection";

// ────────────────────────────────────────────────────────
// Error Boundary — catches render-time crashes in children
// ────────────────────────────────────────────────────────
class SessionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[SessionErrorBoundary] Caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-accent-rose/20 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-rose">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-text-primary">Session Error</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-md">
            Something went wrong during the voice session. This is usually a temporary issue.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReset?.();
            }}
            className="btn-primary"
          >
            Try Again
          </button>
          <p className="text-text-muted text-xs mt-4 font-mono max-w-md break-all">
            {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// ────────────────────────────────────────────────────────
// App Root
// ────────────────────────────────────────────────────────

export default function App() {
  const { connectionState, connectionData, error, connect, disconnect } = useAgentConnection();

  const isConnected = connectionState === "connected" && connectionData;

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.div
            key="connection-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <ConnectionScreen 
              onConnect={connect} 
              isConnecting={connectionState === "connecting"} 
              error={error} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="session-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full w-full"
          >
            <LiveKitRoom
              serverUrl={connectionData.url}
              token={connectionData.token}
              connect={true}
              audio={true}
              video={false}
              onDisconnected={() => {
                console.log("[LiveKit] Room disconnected");
                disconnect();
              }}
              onError={(err) => {
                console.error("[LiveKit] Room error:", err);
              }}
            >
              <SessionErrorBoundary onReset={disconnect}>
                <SessionView onDisconnect={disconnect} />
              </SessionErrorBoundary>
            </LiveKitRoom>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
