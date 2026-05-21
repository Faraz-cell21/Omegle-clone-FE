const isDev = import.meta.env.DEV;

const trim = (value: string | undefined) => value?.trim() ?? "";

function devHttpBase() {
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${window.location.hostname}:8000`;
}

export const API_BASE_URL =
  trim(import.meta.env.VITE_API_BASE_URL) ||
  (isDev ? devHttpBase() : window.location.origin);

export const API_PREFIX =
  trim(import.meta.env.VITE_API_PREFIX) ||
  (isDev ? "/api" : `${API_BASE_URL}/api`);

export const ADMIN_LOGIN_API_URL =
  trim(import.meta.env.VITE_ADMIN_LOGIN_API_URL) ||
  `${API_PREFIX}/auth/login/`;

export const ADMIN_LOGIN_PATH =
  trim(import.meta.env.VITE_ADMIN_LOGIN_PATH) || "/ops-gate-7f3x-enter";

export const ADMIN_DASHBOARD_PATH =
  trim(import.meta.env.VITE_ADMIN_DASHBOARD_PATH) || "/ops-gate-7f3x-console";

export const WS_URL = isDev
  ? `ws://${window.location.hostname}:8000/ws/chat/`
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws/chat/`;

export const TURNSTILE_SITE_KEY = trim(import.meta.env.VITE_TURNSTILE_SITE_KEY);

export const TURNSTILE_ENABLED =
  import.meta.env.VITE_TURNSTILE_ENABLED !== "false" &&
  TURNSTILE_SITE_KEY.length > 0;
