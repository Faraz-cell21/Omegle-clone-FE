export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "queueing"
  | "matched"
  | "reconnecting"
  | "disconnected"
  | "banned";



export type MessageSender = "me" | "partner" | "system";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  message: string;
  timestamp: number;
}



export type MatchMode = "tags" | "global";

export interface ChatState {
  status: ConnectionStatus;

  sessionId: string | null;

  roomId: string | null;

  matchMode: MatchMode;

  selectedTags: string[];

  matchedTags: string[];

  messages: ChatMessage[];

  isPartnerTyping: boolean;

  partnerLeft: boolean;

  reconnectAttempts: number;

  queueCooldownUntil: number | null;

  rateLimitedUntil: number | null;
}



/* =========================
   CLIENT → SERVER EVENTS
========================= */

export interface HeartbeatEvent {
  type: "heartbeat";
}

export interface JoinQueueEvent {
  type: "join_queue";
  tags: string[];
}

export interface MessageEvent {
  type: "message";
  message: string;
}

export interface TypingEvent {
  type: "typing";
}

export interface ReportEvent {
  type: "report";
  reason: string;
}

export type ClientEvent =
  | HeartbeatEvent
  | JoinQueueEvent
  | MessageEvent
  | TypingEvent
  | ReportEvent;



/* =========================
   SERVER → CLIENT EVENTS
========================= */

export interface SessionCreatedEvent {
  type: "session_created";
  session_id: string;
}

export interface WaitingEvent {
  type: "waiting";
  message?: string;
  tags?: string[];
}

export interface MatchedEvent {
  type: "matched";
  room_id: string;
  matched_tags: string[];
}

export interface IncomingMessageEvent {
  type: "message";
  sender: string;
  message: string;
}

export interface IncomingTypingEvent {
  type: "typing";
}

export interface PartnerDisconnectedEvent {
  type: "partner_disconnected";
}

export interface ReportSubmittedEvent {
  type: "report_submitted";
}

export interface ErrorEvent {
  type: "error";
  message: string;
}

export interface BannedEvent {
  type: "banned";
}

export type ServerEvent =
  | SessionCreatedEvent
  | WaitingEvent
  | MatchedEvent
  | IncomingMessageEvent
  | IncomingTypingEvent
  | PartnerDisconnectedEvent
  | ReportSubmittedEvent
  | ErrorEvent
  | BannedEvent;