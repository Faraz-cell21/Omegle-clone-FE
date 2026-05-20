import { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "~/lib/utils";

const INPUT_ROW_HEIGHT = "h-12";

interface MessageInputProps {
  onSend: (text: string) => void;
  onTyping: () => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  onTyping,
  onSkip,
  disabled,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const typingRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    typingRef.current = false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      onTyping();
      setTimeout(() => {
        typingRef.current = false;
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative z-10 w-full shrink-0 border-t border-border/60 bg-background/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-4 sm:py-4">
      <div className={cn("flex w-full items-stretch gap-2", INPUT_ROW_HEIGHT)}>
        <Button
          type="button"
          variant="outline"
          className={cn(
            INPUT_ROW_HEIGHT,
            "min-w-[4.75rem] shrink-0 rounded-xl border-border/80 bg-card px-5 shadow-sm",
          )}
          onClick={onSkip}
          disabled={disabled}
        >
          Skip
        </Button>

        <div
          className={cn(
            INPUT_ROW_HEIGHT,
            "flex min-w-0 flex-1 items-center gap-1 rounded-xl border border-border/60 bg-card px-2 shadow-sm ring-1 ring-black/[0.02]",
          )}
        >
          <Textarea
            ref={inputRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Slow down a moment..." : "Type a message..."}
            disabled={disabled}
            className={cn(
              "h-12 !min-h-0 flex-1 resize-none border-0 bg-transparent px-3 shadow-none",
              "py-3 text-left leading-6",
              "placeholder:text-left placeholder:leading-6",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
            )}
            rows={1}
          />
          <Button
            type="button"
            size="icon"
            className="size-9 shrink-0 rounded-lg shadow-sm"
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            aria-label="Send message"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
