import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { WS_URL } from "~/config/env";
import { useChatStore } from "../store/chat-store";
import type {
  ClientEvent,
  ErrorEvent,
  IncomingMessageEvent,
  MatchedEvent,
  ServerEvent,
  SessionCreatedEvent,
} from "../models/chat.models";

const HEARTBEAT_INTERVAL = 15000;
const RECONNECT_DELAY = 3000;
const MAX_RECONNECT_ATTEMPTS = 8;
const QUEUE_COOLDOWN_MS = 3000;
const RATE_LIMIT_MS = 1000;

const TAB_LOCK_KEY = "vait:chat:active-tab";
const TAB_LOCK_TTL_MS = 20000;
const TAB_LOCK_REFRESH_MS = 5000;

interface TabLock {
  tabId: string;
  updatedAt: number;
}

function randomTabId() {
  return `tab_${crypto.randomUUID()}`;
}

function readTabLock(): TabLock | null {
  try {
    const raw = localStorage.getItem(TAB_LOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TabLock;
    if (!parsed.tabId || typeof parsed.updatedAt !== "number") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function isLockFresh(lock: TabLock | null) {
  return !!lock && Date.now() - lock.updatedAt <= TAB_LOCK_TTL_MS;
}

export function useSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const lockRefreshRef = useRef<number | null>(null);
  const intentionalCloseRef = useRef(false);
  const tabIdRef = useRef<string>(randomTabId());

  const {
    addMessage,
    clearRoom,
    incrementReconnectAttempts,
    leaveRoomForRematch,
    markPartnerLeft,
    resetEntireState,
    resetReconnectAttempts,
    setConnectionNotice,
    setPartnerTyping,
    setQueueCooldownUntil,
    setRateLimitedUntil,
    setRoom,
    setSessionId,
    transitionTo,
  } = useChatStore();

  const writeOwnTabLock = useCallback(() => {
    const lock: TabLock = {
      tabId: tabIdRef.current,
      updatedAt: Date.now(),
    };
    localStorage.setItem(TAB_LOCK_KEY, JSON.stringify(lock));
  }, []);

  const acquireTabLock = useCallback(
    (force = false) => {
      const existing = readTabLock();
      const own = existing?.tabId === tabIdRef.current;
      const canAcquire = own || !isLockFresh(existing) || force;
      if (!canAcquire) return false;
      writeOwnTabLock();
      return true;
    },
    [writeOwnTabLock],
  );

  const releaseTabLock = useCallback(() => {
    const lock = readTabLock();
    if (lock?.tabId === tabIdRef.current) {
      localStorage.removeItem(TAB_LOCK_KEY);
    }
  }, []);

  const stopLockRefresh = useCallback(() => {
    if (lockRefreshRef.current !== null) {
      clearInterval(lockRefreshRef.current);
      lockRefreshRef.current = null;
    }
  }, []);

  const startLockRefresh = useCallback(() => {
    stopLockRefresh();
    writeOwnTabLock();
    lockRefreshRef.current = window.setInterval(() => {
      writeOwnTabLock();
    }, TAB_LOCK_REFRESH_MS);
  }, [stopLockRefresh, writeOwnTabLock]);

  const sendEvent = useCallback((event: ClientEvent) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify(event));
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current !== null) {
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
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    if (!acquireTabLock(false)) {
      transitionTo("disconnected");
      setConnectionNotice(
        "Another tab is currently using chat. Focus this tab to take over the session.",
      );
      return;
    }

    intentionalCloseRef.current = false;
    transitionTo("connecting");

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      resetReconnectAttempts();
      transitionTo("connected");
      setConnectionNotice(null);
      startHeartbeat();
      startLockRefresh();
    };

    socket.onmessage = (rawEvent) => {
      try {
        const event: ServerEvent = JSON.parse(rawEvent.data);
        switch (event.type) {
          case "session_created":
            handleSessionCreatedEvent(event);
            break;
          case "waiting":
            setConnectionNotice("Looking for a partner...");
            if (useChatStore.getState().status !== "queueing") {
              transitionTo("queueing");
            }
            break;
          case "matched":
            setConnectionNotice(null);
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
          case "timeout":
            setConnectionNotice(event.message || "Connection timed out. Reconnecting...");
            toast.error(event.message || "Connection timed out");
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
      stopLockRefresh();
      releaseTabLock();

      if (intentionalCloseRef.current) {
        intentionalCloseRef.current = false;
        return;
      }

      incrementReconnectAttempts();
      const nextAttempt = useChatStore.getState().reconnectAttempts;

      if (nextAttempt > MAX_RECONNECT_ATTEMPTS) {
        transitionTo("disconnected");
        setConnectionNotice(
          "Connection lost after multiple retries. Check network and tap Connect again.",
        );
        return;
      }

      const { status } = useChatStore.getState();
      if (status !== "matched") {
        clearRoom();
      }

      transitionTo("reconnecting");
      setConnectionNotice(`Reconnecting... attempt ${nextAttempt} of ${MAX_RECONNECT_ATTEMPTS}`);
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, RECONNECT_DELAY);
    };

    socket.onerror = () => {
      toast.error("WebSocket error");
    };
  }, [
    acquireTabLock,
    clearRoom,
    handleErrorEvent,
    handleMatchedEvent,
    handleMessageEvent,
    handleSessionCreatedEvent,
    incrementReconnectAttempts,
    markPartnerLeft,
    releaseTabLock,
    resetReconnectAttempts,
    setConnectionNotice,
    setPartnerTyping,
    startHeartbeat,
    startLockRefresh,
    stopHeartbeat,
    stopLockRefresh,
    transitionTo,
  ]);

  const closeSocket = useCallback(
    (withReset: boolean) => {
      stopHeartbeat();
      stopLockRefresh();
      releaseTabLock();
      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      intentionalCloseRef.current = true;
      socketRef.current?.close();
      socketRef.current = null;
      if (withReset) {
        resetEntireState();
      }
    },
    [releaseTabLock, resetEntireState, stopHeartbeat, stopLockRefresh],
  );

  const disconnect = useCallback(() => {
    closeSocket(true);
  }, [closeSocket]);

  const endChat = useCallback(() => {
    clearRoom();
    intentionalCloseRef.current = false;
    socketRef.current?.close();
  }, [clearRoom]);

  const exitToHome = useCallback(() => {
    const { roomId, status } = useChatStore.getState();
    const needsServerLeave = roomId !== null || status === "queueing" || status === "matched";
    clearRoom();
    if (!needsServerLeave || !socketRef.current) return;

    closeSocket(false);
    window.setTimeout(() => {
      connect();
    }, 150);
  }, [clearRoom, closeSocket, connect]);

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

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== TAB_LOCK_KEY) return;
      const lock = readTabLock();
      const socketOpen = socketRef.current?.readyState === WebSocket.OPEN;
      if (socketOpen && lock && lock.tabId !== tabIdRef.current && isLockFresh(lock)) {
        setConnectionNotice("Chat moved to another tab. Focus this tab to take over.");
        transitionTo("disconnected");
        closeSocket(false);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      const tookLock = acquireTabLock(true);
      if (!tookLock) return;
      if (socketRef.current?.readyState !== WebSocket.OPEN) {
        connect();
      }
    };

    const onPageHide = () => {
      closeSocket(false);
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("beforeunload", onPageHide);

    connect();

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onPageHide);
      disconnect();
    };
  }, [acquireTabLock, closeSocket, connect, disconnect, setConnectionNotice, transitionTo]);

  return {
    sendEvent,
    connect,
    disconnect,
    endChat,
    exitToHome,
    startNewChat,
  };
}
