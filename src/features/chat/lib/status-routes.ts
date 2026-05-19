import type { ConnectionStatus } from "../models/chat.models";

export const STATUS_ROUTES: Partial<Record<ConnectionStatus, string>> = {
  idle: "/",
  connecting: "/",
  connected: "/",
  queueing: "/waiting",
  matched: "/chat",
  reconnecting: "/reconnecting",
  disconnected: "/",
  banned: "/banned",
};

export function routeForStatus(status: ConnectionStatus): string {
  return STATUS_ROUTES[status] ?? "/";
}
