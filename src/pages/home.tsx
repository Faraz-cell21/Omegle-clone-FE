import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Globe,
  MessageCircle,
  Shield,
  Tags,
} from "lucide-react";
import { VaitLogo } from "~/components/brand/vait-logo";
import type { MatchMode } from "~/features/chat/models/chat.models";
import { useChatStore } from "~/features/chat/store/chat-store";
import { TagSelector } from "~/features/chat/components/tag-selector";
import { useSocketContext } from "~/features/chat/context/socket-context";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

const GUIDELINES = [
  "Be kind and respectful. Don't be creepy, pushy, or make anyone uncomfortable.",
  "No harassment, hate speech, threats, sexual content, or illegal activity.",
  "Never ask for or share personal details (full name, address, phone, socials).",
  "You must be 18 or older to use this service.",
  "Misbehavior may result in a temporary ban.",
] as const;

const STEPS = [
  {
    icon: Tags,
    title: "Add tags or go global",
    text: "Match by interests, or chat with anyone.",
  },
  {
    icon: MessageCircle,
    title: "Get matched",
    text: "We pair you with someone available.",
  },
  {
    icon: Shield,
    title: "Chat safely",
    text: "Leave anytime and start a new chat.",
  },
] as const;

function ConnectButtons({
  isConnecting,
  canConnectGlobal,
  canConnectTags,
  onGlobal,
  onTags,
  className,
}: {
  isConnecting: boolean;
  canConnectGlobal: boolean;
  canConnectTags: boolean;
  onGlobal: () => void;
  onTags: () => void;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2 sm:grid-cols-2", className)}>
      <Button
        variant="outline"
        size="lg"
        className="h-11 sm:h-12 gap-2"
        onClick={onGlobal}
        disabled={!canConnectGlobal}
      >
        <Globe className="size-4 shrink-0" aria-hidden />
        {isConnecting ? "Connecting..." : "Global chat"}
      </Button>
      <Button
        size="lg"
        className="h-11 sm:h-12 gap-2"
        onClick={onTags}
        disabled={!canConnectTags}
      >
        <Tags className="size-4 shrink-0" aria-hidden />
        {isConnecting ? "Connecting..." : "Connect with tags"}
      </Button>
    </div>
  );
}

export default function HomePage() {
  const { sendEvent } = useSocketContext();
  const {
    selectedTags,
    setSelectedTags,
    setMatchMode,
    status,
    queueCooldownUntil,
  } = useChatStore();
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (!queueCooldownUntil) {
      setCooldownRemaining(0);
      return;
    }

    const tick = () => {
      setCooldownRemaining(Math.max(0, queueCooldownUntil - Date.now()));
    };

    tick();
    const id = window.setInterval(tick, 200);
    return () => clearInterval(id);
  }, [queueCooldownUntil]);

  const isConnecting = status === "connecting" || status === "idle";
  const isReady = !isConnecting && status === "connected" && cooldownRemaining === 0;

  const canConnectGlobal = isReady;
  const canConnectTags = isReady && selectedTags.length > 0;

  const joinQueue = (mode: MatchMode) => {
    setMatchMode(mode);
    const tags = mode === "global" ? [] : selectedTags;
    sendEvent({ type: "join_queue", tags });
  };

  const startGlobal = () => joinQueue("global");
  const startWithTags = () => joinQueue("tags");

  const cooldownHint =
    cooldownRemaining > 0
      ? `Wait ${Math.ceil(cooldownRemaining / 1000)}s before connecting again`
      : null;

  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col">
      <div
        className="pointer-events-none fixed inset-0 hidden lg:block"
        aria-hidden
      >
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <main className="relative flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-36 lg:pb-12 lg:pt-10">
        <header className="mb-8 lg:mb-10 flex flex-col items-center text-center gap-6">
          <VaitLogo size="lg" />
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Chat one-on-one with strangers. Add your own tags to find people with
            shared interests, or jump into global chat to meet anyone.
          </p>
        </header>

        <section
          aria-label="How it works"
          className="mb-8 lg:mb-10 grid gap-3 sm:grid-cols-3 lg:gap-4"
        >
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-xl border bg-card p-4 lg:p-5 sm:flex-col sm:items-center sm:text-center"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:mx-auto lg:size-11">
                <Icon className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm lg:text-base font-medium">{title}</p>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10 lg:items-start">
          <Card className="border-warning/30 bg-warning/5 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base lg:text-lg text-warning">
                <AlertTriangle className="size-4 lg:size-5 shrink-0" aria-hidden />
                Community guidelines
              </CardTitle>
              <CardDescription className="text-left text-sm lg:text-base">
                This is a public space. Help keep it safe for everyone.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3 text-sm lg:text-base text-foreground/90 leading-relaxed">
                {GUIDELINES.map((rule) => (
                  <li key={rule} className="flex gap-2.5 lg:gap-3">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-warning"
                      aria-hidden
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="lg:sticky lg:top-8 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Start a chat</CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Global chat connects you with anyone. Tag chat matches shared
                interests only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TagSelector
                selectedTags={selectedTags}
                onChange={setSelectedTags}
                disabled={status !== "connected"}
              />

              {cooldownHint && (
                <p className="text-sm text-center text-warning">{cooldownHint}</p>
              )}

              <ConnectButtons
                isConnecting={isConnecting}
                canConnectGlobal={canConnectGlobal}
                canConnectTags={canConnectTags}
                onGlobal={startGlobal}
                onTags={startWithTags}
                className="hidden sm:grid"
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
          "px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden",
        )}
      >
        <div className="mx-auto w-full max-w-lg space-y-2">
          {cooldownHint && (
            <p className="text-center text-xs text-warning">{cooldownHint}</p>
          )}
          <ConnectButtons
            isConnecting={isConnecting}
            canConnectGlobal={canConnectGlobal}
            canConnectTags={canConnectTags}
            onGlobal={startGlobal}
            onTags={startWithTags}
          />
        </div>
      </div>
    </div>
  );
}
