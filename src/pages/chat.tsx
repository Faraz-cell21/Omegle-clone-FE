import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ChevronLeft, MessageCircle, Sparkles } from "lucide-react";
import { ChatotLogo } from "~/components/brand/chatot-logo";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { MessageBubble } from "~/features/chat/components/message-bubble";
import { MessageInput } from "~/features/chat/components/message-input";
import { useSocketContext } from "~/features/chat/context/socket-context";
import { useChatStore } from "~/features/chat/store/chat-store";
import { cn } from "~/lib/utils";

const CHAT_GUIDELINES = [
  "Be kind and respectful",
  "18+ only",
  "No personal info",
  "No harassment or hate speech",
  "No illegal or sexual content",
  "Skip anytime",
] as const;

function ChatGuidelines() {
  return (
    <div className="relative z-10 shrink-0 border-b border-warning/20 bg-warning/5 px-3 py-2 sm:px-4">
      <div className="flex items-start gap-2">
        <AlertTriangle
          className="mt-0.5 size-3.5 shrink-0 text-warning"
          aria-hidden
        />
        <p className="text-xs leading-relaxed text-foreground/80">
          {CHAT_GUIDELINES.map((rule, index) => (
            <span key={rule}>
              {index > 0 && (
                <span className="mx-1.5 text-muted-foreground/60" aria-hidden>
                  ·
                </span>
              )}
              {rule}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 self-start px-1 py-1">
      <span className="inline-flex gap-1 rounded-full bg-muted px-3 py-2">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 rounded-full bg-muted-foreground/70 animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground">typing</span>
    </div>
  );
}

export default function ChatPage() {
  const { sendEvent, startNewChat, exitToHome } = useSocketContext();
  const {
    messages,
    matchedTags,
    isPartnerTyping,
    partnerLeft,
    rateLimitedUntil,
    connectionNotice,
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const chatEnded = partnerLeft;
  const showEmptyState = messages.length === 0 && !chatEnded;

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

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <header className="relative z-10 shrink-0 border-b border-border/60 bg-background/80 px-3 py-3 backdrop-blur-md sm:px-4">
        <div className="relative flex items-center justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-0 size-10 rounded-lg border-border/80 bg-muted text-foreground shadow-sm",
              "hover:bg-muted hover:text-foreground active:bg-muted",
            )}
            onClick={exitToHome}
            aria-label="Back to home"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <ChatotLogo variant="wordmark" size="sm" />
        </div>
      </header>

      <ChatGuidelines />

      {connectionNotice && !partnerLeft && (
        <div className="relative z-10 border-b border-border/40 bg-muted/40 px-4 py-2 text-center text-xs text-muted-foreground">
          {connectionNotice}
        </div>
      )}

      {matchedTags.length > 0 && (
        <div className="relative z-10 shrink-0 border-b border-border/40 bg-card/50 px-4 py-2.5 backdrop-blur-sm">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-1.5">
            <Sparkles
              className="size-3.5 shrink-0 text-primary"
              aria-hidden
            />
            <span className="text-xs font-medium text-muted-foreground">
              Shared interests
            </span>
            {matchedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full border-0 bg-primary/10 px-2.5 text-xs font-medium text-primary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="relative z-10 min-h-0 flex-1">
        <div
          className={cn(
            "mx-auto flex min-h-full max-w-2xl flex-col gap-3 px-4 py-6",
            showEmptyState && "justify-center",
          )}
        >
          {showEmptyState && (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10">
                <MessageCircle className="size-7" aria-hidden />
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-medium text-foreground">
                  You are connected
                </p>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  Say hello. Your partner is waiting.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isPartnerTyping && !chatEnded && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {chatEnded ? (
        <div className="relative z-10 shrink-0 border-t border-border/60 bg-background/90 p-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/80 px-6 py-5 text-center shadow-sm">
            <p className="text-sm font-medium text-foreground">
              Your partner disconnected
            </p>
            <p className="text-xs text-muted-foreground">
              Start a new chat to meet someone else.
            </p>
            <Button className="rounded-full px-6" onClick={startNewChat}>
              Find someone new
            </Button>
          </div>
        </div>
      ) : (
        <MessageInput
          onSend={handleSend}
          onTyping={() => sendEvent({ type: "typing" })}
          onSkip={startNewChat}
          disabled={rateLimited}
        />
      )}
    </div>
  );
}
