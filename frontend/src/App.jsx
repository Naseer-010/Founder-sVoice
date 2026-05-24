/**
 * App.jsx — Root component.
 * Routes between landing page and live session.
 * RoomAudioRenderer is CRITICAL — without it, remote audio tracks are not played.
 */

import React from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";

import ConnectionScreen from "./components/ConnectionScreen";
import SessionView from "./components/SessionView";
import { useAgentConnection } from "./hooks/useAgentConnection";

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(err, info) { console.error("[ErrorBoundary]", err, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Something went wrong</p>
          <p style={{ color: "#71717a", fontSize: 13, marginBottom: 20, maxWidth: 400, textAlign: "center" }}>{this.state.error.message}</p>
          <button onClick={() => { this.setState({ error: null }); this.props.onReset?.(); }} className="btn-primary">Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { connectionState, connectionData, error, connect, disconnect } = useAgentConnection();
  const isConnected = connectionState === "connected" && connectionData;

  if (!isConnected) {
    return (
      <ConnectionScreen
        onConnect={connect}
        isConnecting={connectionState === "connecting"}
        error={error}
      />
    );
  }

  return (
    <LiveKitRoom
      serverUrl={connectionData.url}
      token={connectionData.token}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={() => disconnect()}
      onError={(err) => console.error("[LiveKit]", err)}
      style={{ height: "100%", width: "100%" }}
    >
      {/* THIS is what actually plays the agent's audio track */}
      <RoomAudioRenderer />
      <ErrorBoundary onReset={disconnect}>
        <SessionView onDisconnect={disconnect} />
      </ErrorBoundary>
    </LiveKitRoom>
  );
}
