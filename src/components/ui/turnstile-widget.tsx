import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";

interface TurnstileWidgetProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  className?: string;
}

export function TurnstileWidget({
  siteKey,
  onSuccess,
  onError,
  onExpire,
  theme = "auto",
  size = "normal",
  className = "",
}: TurnstileWidgetProps) {
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleError = (error: string) => {
    console.error("Turnstile error:", error);
    onError?.(error);
  };

  return (
    <div className={className}>
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={handleError}
        onExpire={onExpire}
        options={{
          theme,
          size,
        }}
      />
    </div>
  );
}
