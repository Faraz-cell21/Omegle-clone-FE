import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { VaitLogo } from "~/components/brand/vait-logo";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { MessageBubble } from "~/features/chat/components/message-bubble";
import { MessageInput } from "~/features/chat/components/message-input";
import { ReportDialog } from "~/features/chat/components/report-dialog";
import { useSocketContext } from "~/features/chat/context/socket-context";
import { useChatStore } from "~/features/chat/store/chat-store";
import { useDisclosure } from "~/hooks/use-disclosure";

export default function ChatPage() {
  const { sendEvent, startNewChat } = useSocketContext();
  const {
    messages,
    roomId,
    matchedTags,
    isPartnerTyping,
    partnerLeft,
    rateLimitedUntil,
  } = useChatStore();
  const report = useDisclosure();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const chatEnded = partnerLeft;

  useEffect(() => {
    if (!rateLimitedUntil) {
      setRateLimited(false);
      return;
    }
    const tick = () => setRateLimited(rateLimitedUntil > Date.now());
    tick();
    const id = window.setInterval(tick, 100);
    return () => clearInterval(id);
  }, [rateLimitedUntil]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping, partnerLeft]);

  const handleSend = (text: string) => {
    sendEvent({ type: "message", message: text });
  };

  const handleReport = (reason: string) => {
    sendEvent({ type: "report", reason });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex justify-start">
          <Button variant="outline" size="sm" onClick={startNewChat}>
            New chat
          </Button>
        </div>

        <Link to="/" className="justify-self-center px-2">
          <VaitLogo variant="wordmark" size="sm" />
        </Link>

        <div className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={report.open}>
            Report
          </Button>
        </div>
      </header>

      {(roomId || matchedTags.length > 0) && (
        <div className="shrink-0 border-b px-4 py-2">
          <p className="text-xs text-muted-foreground truncate text-center">
            {roomId && <span className="mr-2">Room: {roomId}</span>}
            {matchedTags.length > 0 && (
              <span className="inline-flex flex-wrap gap-1 justify-center">
                {matchedTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </span>
            )}
          </p>
        </div>
      )}

      <ScrollArea className="min-h-0 flex-1 p-4">
        <div className="flex flex-col gap-3">
          {messages.length === 0 && !chatEnded && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Say hello — your partner is waiting.
            </p>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isPartnerTyping && !chatEnded && (
            <p className="text-xs text-muted-foreground">Partner is typing...</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {chatEnded ? (
        <div
          role="status"
          className="flex min-h-16 shrink-0 items-center justify-center border-t bg-background p-3"
        >
          <p className="text-sm font-medium text-muted-foreground">
            User disconnected
          </p>
        </div>
      ) : (
        <MessageInput
          onSend={handleSend}
          onTyping={() => sendEvent({ type: "typing" })}
          disabled={rateLimited}
        />
      )}

      <ReportDialog
        open={report.isOpen}
        onClose={report.close}
        onSubmit={handleReport}
      />
    </div>
  );
}
