/**
 * App.jsx — Root Application Component
 *
 * Manages the top-level routing between the ConnectionScreen and the active SessionView.
 * Wraps the SessionView in LiveKitRoom to provide WebRTC context.
 */

import { LiveKitRoom } from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";

import AppShell from "./components/layout/AppShell";
import ConnectionScreen from "./components/session/ConnectionScreen";
import SessionView from "./components/session/SessionView";
import { useAgentConnection } from "./hooks/useAgentConnection";

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
              onDisconnected={disconnect}
            >
              <SessionView onDisconnect={disconnect} />
            </LiveKitRoom>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
