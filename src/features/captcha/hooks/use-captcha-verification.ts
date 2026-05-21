import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  TURNSTILE_ENABLED,
  TURNSTILE_SITE_KEY,
} from "~/config";
import { verifyCaptcha } from "../lib/captcha-api";

const CAPTCHA_STORAGE_KEY = "chatot:captcha-verified-until";

function readStoredExpiry() {
  try {
    const raw = sessionStorage.getItem(CAPTCHA_STORAGE_KEY);
    if (!raw) return 0;
    const expiresAt = Number(raw);
    return Number.isFinite(expiresAt) ? expiresAt : 0;
  } catch {
    return 0;
  }
}

function writeStoredExpiry(expiresAt: number) {
  try {
    sessionStorage.setItem(CAPTCHA_STORAGE_KEY, String(expiresAt));
  } catch {
    // ignore quota / private mode
  }
}

function clearStoredExpiry() {
  try {
    sessionStorage.removeItem(CAPTCHA_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function useCaptchaVerification() {
  const [verifiedUntil, setVerifiedUntil] = useState(() => readStoredExpiry());
  const [verifying, setVerifying] = useState(false);

  const isCaptchaRequired = TURNSTILE_ENABLED && !!TURNSTILE_SITE_KEY;
  const isVerified =
    !isCaptchaRequired || (verifiedUntil > 0 && verifiedUntil > Date.now());

  const markVerified = useCallback((expiresInSeconds: number) => {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    writeStoredExpiry(expiresAt);
    setVerifiedUntil(expiresAt);
  }, []);

  const clearVerification = useCallback(() => {
    clearStoredExpiry();
    setVerifiedUntil(0);
  }, []);

  const verifyTurnstileToken = useCallback(
    async (token: string) => {
      if (!isCaptchaRequired) {
        markVerified(30 * 60);
        return true;
      }

      try {
        setVerifying(true);
        const result = await verifyCaptcha(token);
        if (!result.validity) {
          throw new Error(result.message || "Captcha verification failed");
        }
        markVerified(result.expires_in ?? 30 * 60);
        return true;
      } catch (error) {
        clearVerification();
        toast.error(
          error instanceof Error ? error.message : "Captcha verification failed",
        );
        return false;
      } finally {
        setVerifying(false);
      }
    },
    [clearVerification, isCaptchaRequired, markVerified],
  );

  return {
    isCaptchaRequired,
    isVerified,
    verifying,
    turnstileSiteKey: TURNSTILE_SITE_KEY,
    verifyTurnstileToken,
    clearVerification,
  };
}
