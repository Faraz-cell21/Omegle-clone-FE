import { cn } from "~/lib/utils";
import type { ChatMessage } from "../models/chat.models";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.sender === "system") {
    return (
      <p
        role="status"
        className="text-center text-xs text-muted-foreground py-2"
      >
        {message.message}
      </p>
    );
  }

  const isMe = message.sender === "me";

  return (
    <div
      className={cn(
        "flex max-w-[85%] sm:max-w-[75%]",
        isMe ? "self-end" : "self-start",
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isMe
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border/50 bg-card text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
      </div>
    </div>
  );
}
