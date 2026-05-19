import { create } from "zustand";

import type {
  ChatMessage,
  ChatState,
  ConnectionStatus,
  MatchMode,
} from "../models/chat.models";



interface ChatStore extends ChatState {

  transitionTo: (
    status: ConnectionStatus
  ) => void;

  setSessionId: (
    sessionId: string
  ) => void;

  setSelectedTags: (
    tags: string[]
  ) => void;

  setMatchMode: (mode: MatchMode) => void;

  setRoom: (
    roomId: string,
    matchedTags: string[]
  ) => void;

  clearRoom: () => void;

  leaveRoomForRematch: () => void;

  markPartnerLeft: () => void;

  addMessage: (
    message: ChatMessage
  ) => void;

  clearMessages: () => void;

  setPartnerTyping: (
    value: boolean
  ) => void;

  incrementReconnectAttempts:
    () => void;

  resetReconnectAttempts:
    () => void;

  resetEntireState: () => void;

  setQueueCooldownUntil: (until: number | null) => void;

  setRateLimitedUntil: (until: number | null) => void;
}



const validTransitions:
  Record<
    ConnectionStatus,
    ConnectionStatus[]
  > = {

  idle: [
    "connecting",
  ],

  connecting: [
    "connected",
    "disconnected",
    "reconnecting",
    "banned",
  ],

  connected: [
    "queueing",
    "disconnected",
    "reconnecting",
    "banned",
  ],

  queueing: [
    "matched",
    "connected",
    "disconnected",
    "reconnecting",
    "banned",
  ],

  matched: [
    "connected",
    "queueing",
    "disconnected",
    "reconnecting",
    "banned",
  ],

  reconnecting: [
    "connected",
    "disconnected",
    "banned",
  ],

  disconnected: [
    "connecting",
  ],

  banned: [],
};



export const useChatStore =
  create<ChatStore>(
    (set, get) => ({

      status: "idle",

      sessionId: null,

      roomId: null,

      matchMode: "tags",

      selectedTags: [],

      matchedTags: [],

      messages: [],

      isPartnerTyping: false,

      partnerLeft: false,

      reconnectAttempts: 0,

      queueCooldownUntil: null,

      rateLimitedUntil: null,

      transitionTo: (
        nextStatus
      ) => {

        const currentStatus =
          get().status;

        const allowedTransitions =
          validTransitions[
            currentStatus
          ];

        const isAllowed =
          allowedTransitions.includes(
            nextStatus
          );

        if (!isAllowed) {

          console.warn(
            `Invalid state transition: ${currentStatus} → ${nextStatus}`
          );

          return;
        }

        set({
          status: nextStatus,
        });
      },



      setSessionId: (
        sessionId
      ) =>
        set({
          sessionId,
        }),



      setSelectedTags: (
        tags
      ) =>
        set({
          selectedTags: tags,
        }),

      setMatchMode: (mode) =>
        set({ matchMode: mode }),

      setRoom: (
        roomId,
        matchedTags
      ) =>
        set({
          roomId,
          matchedTags,
          partnerLeft: false,
          status: "matched",
        }),



      clearRoom: () =>
        set({
          roomId: null,
          matchedTags: [],
          isPartnerTyping: false,
          partnerLeft: false,
          messages: [],
          status: "connected",
        }),

      leaveRoomForRematch: () =>
        set({
          roomId: null,
          matchedTags: [],
          isPartnerTyping: false,
          partnerLeft: false,
          messages: [],
          status: "queueing",
        }),

      markPartnerLeft: () =>
        set((state) => ({
          partnerLeft: true,
          isPartnerTyping: false,
        })),

      addMessage: (
        message
      ) =>
        set((state) => ({
          messages: [
            ...state.messages,
            message,
          ],
        })),



      clearMessages: () =>
        set({
          messages: [],
        }),



      setPartnerTyping: (
        value
      ) =>
        set({
          isPartnerTyping: value,
        }),



      incrementReconnectAttempts:
        () =>
          set((state) => ({
            reconnectAttempts:
              state.reconnectAttempts + 1,
          })),



      resetReconnectAttempts:
        () =>
          set({
            reconnectAttempts: 0,
          }),



      resetEntireState: () =>
        set({
          status: "idle",

          sessionId: null,

          roomId: null,

          matchMode: "tags",

          selectedTags: [],

          matchedTags: [],

          messages: [],

          isPartnerTyping: false,

          partnerLeft: false,

          reconnectAttempts: 0,

          queueCooldownUntil: null,

          rateLimitedUntil: null,
        }),

      setQueueCooldownUntil: (until) =>
        set({ queueCooldownUntil: until }),

      setRateLimitedUntil: (until) =>
        set({ rateLimitedUntil: until }),
    })
  );