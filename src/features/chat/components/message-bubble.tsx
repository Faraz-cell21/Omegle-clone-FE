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
    <div className={cn("flex gap-2 max-w-[80%]", isMe ? "self-end flex-row-reverse" : "self-start")}>
      <div
        className={cn(
          "rounded-2xl px-4 py-2 text-sm",
          isMe
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
      </div>
    </div>
  );
}
