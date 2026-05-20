import { createContext, useContext, type ReactNode } from "react";
import { useSocket } from "../hooks/use-socket";
import type { ClientEvent } from "../models/chat.models";

interface SocketContextValue {
  sendEvent: (event: ClientEvent) => void;
  reconnectNow: () => void;
  endChat: () => void;
  exitToHome: () => void;
  startNewChat: () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { sendEvent, connect, endChat, exitToHome, startNewChat } = useSocket();

  return (
    <SocketContext.Provider
      value={{
        sendEvent,
        reconnectNow: connect,
        endChat,
        exitToHome,
        startNewChat,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return ctx;
}
