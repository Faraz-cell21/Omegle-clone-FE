import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { WS_URL } from "~/config/env";
import { useChatStore } from "../store/chat-store";
import type {
  ClientEvent,
  ServerEvent,
  IncomingMessageEvent,
  MatchedEvent,
  SessionCreatedEvent,
  ErrorEvent,
} from "../models/chat.models";

const HEARTBEAT_INTERVAL = 15000;
const RECONNECT_DELAY = 3000;
const QUEUE_COOLDOWN_MS = 3000;
const RATE_LIMIT_MS = 1000;

export function useSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const intentionalCloseRef = useRef(false);

  const {
    transitionTo,
    setSessionId,
    setRoom,
    clearRoom,
    leaveRoomForRematch,
    markPartnerLeft,
    addMessage,
    setPartnerTyping,
    incrementReconnectAttempts,
    resetReconnectAttempts,
    resetEntireState,
    setQueueCooldownUntil,
    setRateLimitedUntil,
  } = useChatStore();

  const sendEvent = useCallback((event: ClientEvent) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      return;
    }
    socketRef.current.send(JSON.stringify(event));
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    heartbeatRef.current = window.setInterval(() => {
      sendEvent({ type: "heartbeat" });
    }, HEARTBEAT_INTERVAL);
  }, [sendEvent, stopHeartbeat]);

  const handleMatchedEvent = useCallback(
    (event: MatchedEvent) => {
      setRoom(event.room_id, event.matched_tags);
      toast.success("Partner found");
    },
    [setRoom],
  );

  const handleMessageEvent = useCallback(
    (event: IncomingMessageEvent) => {
      const sessionId = useChatStore.getState().sessionId;
      const isMe = sessionId !== null && event.sender === sessionId;

      addMessage({
        id: crypto.randomUUID(),
        sender: isMe ? "me" : "partner",
        message: event.message,
        timestamp: Date.now(),
      });
      setPartnerTyping(false);
    },
    [addMessage, setPartnerTyping],
  );

  const handleSessionCreatedEvent = useCallback(
    (event: SessionCreatedEvent) => {
      setSessionId(event.session_id);
      const status = useChatStore.getState().status;
      if (status === "connecting" || status === "idle" || status === "reconnecting") {
        transitionTo("connected");
      }
    },
    [setSessionId, transitionTo],
  );

  const startNewChat = useCallback(() => {
    const { selectedTags, matchMode } = useChatStore.getState();
    const tags = matchMode === "global" ? [] : selectedTags;

    if (matchMode === "tags" && tags.length === 0) {
      clearRoom();
      return;
    }

    leaveRoomForRematch();
    sendEvent({ type: "join_queue", tags });
  }, [clearRoom, leaveRoomForRematch, sendEvent]);

  const handleErrorEvent = useCallback(
    (event: ErrorEvent) => {
      toast.error(event.message);
      if (event.message.includes("cooldown")) {
        setQueueCooldownUntil(Date.now() + QUEUE_COOLDOWN_MS);
      }
      if (event.message.includes("Rate limit")) {
        setRateLimitedUntil(Date.now() + RATE_LIMIT_MS);
      }
    },
    [setQueueCooldownUntil, setRateLimitedUntil],
  );

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    intentionalCloseRef.current = false;
    transitionTo("connecting");

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      resetReconnectAttempts();
      transitionTo("connected");
      startHeartbeat();
    };

    socket.onmessage = (rawEvent) => {
      try {
        const event: ServerEvent = JSON.parse(rawEvent.data);

        switch (event.type) {
          case "session_created":
            handleSessionCreatedEvent(event);
            break;
          case "waiting":
            if (useChatStore.getState().status !== "queueing") {
              transitionTo("queueing");
            }
            break;
          case "matched":
            handleMatchedEvent(event);
            break;
          case "message":
            handleMessageEvent(event);
            break;
          case "typing":
            setPartnerTyping(true);
            setTimeout(() => setPartnerTyping(false), 1500);
            break;
          case "partner_disconnected":
            markPartnerLeft();
            break;
          case "report_submitted":
            toast.success("Report submitted");
            break;
          case "banned":
            transitionTo("banned");
            toast.error("You are temporarily banned");
            break;
          case "error":
            handleErrorEvent(event);
            break;
        }
      } catch (error) {
        console.error("WebSocket parse error:", error);
      }
    };

    socket.onclose = () => {
      stopHeartbeat();
      incrementReconnectAttempts();

      if (intentionalCloseRef.current) {
        intentionalCloseRef.current = false;
        return;
      }

      const { status } = useChatStore.getState();
      if (status !== "matched") {
        clearRoom();
      }

      transitionTo("reconnecting");
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, RECONNECT_DELAY);
    };

    socket.onerror = () => {
      toast.error("WebSocket error");
    };
  }, [
    transitionTo,
    resetReconnectAttempts,
    startHeartbeat,
    handleSessionCreatedEvent,
    handleMatchedEvent,
    handleMessageEvent,
    handleErrorEvent,
    setPartnerTyping,
    clearRoom,
    leaveRoomForRematch,
    markPartnerLeft,
    incrementReconnectAttempts,
    stopHeartbeat,
  ]);

  const disconnect = useCallback(() => {
    stopHeartbeat();
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    intentionalCloseRef.current = true;
    socketRef.current?.close();
    socketRef.current = null;
    resetEntireState();
  }, [stopHeartbeat, resetEntireState]);

  const endChat = useCallback(() => {
    clearRoom();
    intentionalCloseRef.current = false;
    socketRef.current?.close();
  }, [clearRoom]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only
  }, []);

  return {
    sendEvent,
    connect,
    disconnect,
    endChat,
    startNewChat,
  };
}
