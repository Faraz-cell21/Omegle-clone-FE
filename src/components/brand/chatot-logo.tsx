import { cn } from "~/lib/utils";

const LIGHT_BLUE = "#40B3E4";
const DARK_BLUE = "#0089D0";

type ChatotLogoVariant = "full" | "wordmark" | "icon";
type ChatotLogoSize = "sm" | "md" | "lg";

interface ChatotLogoProps {
  className?: string;
  variant?: ChatotLogoVariant;
  size?: ChatotLogoSize;
}

const iconWidths = { sm: 56, md: 84, lg: 112 } as const;

function ChatotIcon({ width }: { width: number }) {
  const height = width * 0.75;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Back bubble */}
      <path
        d="M52 12 H98 Q110 12 110 24 V48 Q110 60 98 60 H72 L58 76 L64 58 H52 Q40 58 40 46 V24 Q40 12 52 12 Z"
        fill="var(--card)"
        stroke={DARK_BLUE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M58 20 H100 M60 28 H92"
        stroke={DARK_BLUE}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <circle cx="72" cy="36" r="2.5" fill="var(--foreground)" />
      <circle cx="82" cy="36" r="2.5" fill="var(--foreground)" />
      <circle cx="92" cy="36" r="2.5" fill="var(--foreground)" />

      {/* Front bubble */}
      <circle
        cx="38"
        cy="38"
        r="28"
        fill="var(--card)"
        stroke={LIGHT_BLUE}
        strokeWidth="3"
      />
      <path
        d="M24 58 L16 74 L32 62 Z"
        fill="var(--card)"
        stroke={LIGHT_BLUE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M26 20 Q38 16 50 22"
        stroke={LIGHT_BLUE}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <circle cx="30" cy="36" r="2.5" fill="var(--foreground)" />
      <circle cx="38" cy="36" r="2.5" fill="var(--foreground)" />
      <circle cx="46" cy="36" r="2.5" fill="var(--foreground)" />
    </svg>
  );
}

function Wordmark({ size }: { size: ChatotLogoSize }) {
  const word =
    size === "sm" ? "text-xl" : size === "md" ? "text-3xl" : "text-4xl sm:text-5xl";
  const slogan =
    size === "sm"
      ? "text-[0.5rem] tracking-[0.35em]"
      : size === "md"
        ? "text-[0.65rem] tracking-[0.45em]"
        : "text-xs sm:text-sm tracking-[0.5em]";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={cn(
          word,
          "font-extrabold uppercase leading-none tracking-tight text-foreground",
        )}
        style={{ fontFamily: "var(--font-logo)" }}
      >
        Chatot
      </span>
      <span
        className={cn(slogan, "font-medium uppercase")}
        style={{ fontFamily: "var(--font-body)", color: DARK_BLUE }}
      >
        Find your vibe
      </span>
    </div>
  );
}

/** Chatot brand logo — SVG speech bubbles, wordmark, and slogan */
export function ChatotLogo({
  className,
  variant = "full",
  size = "md",
}: ChatotLogoProps) {
  const iconWidth = iconWidths[size];

  if (variant === "icon") {
    return (
      <div className={cn("inline-flex", className)} aria-label="Chatot">
        <ChatotIcon width={iconWidth} />
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div
        className={cn("inline-flex", className)}
        aria-label="Chatot — Find your vibe"
      >
        <Wordmark size={size} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-3 text-center",
        className,
      )}
      aria-label="Chatot — Find your vibe"
    >
      <ChatotIcon width={iconWidth} />
      <Wordmark size={size} />
    </div>
  );
}
