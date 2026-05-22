const isDev = import.meta.env.DEV;

const trim = (value: string | undefined) => value?.trim() ?? "";

/** Canonical public site URL (build-time in index.html; runtime export for app use). */
export const SITE_URL = trim(import.meta.env.VITE_SITE_URL);

function devHttpBase() {
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${window.location.hostname}:8000`;
}

const apiBaseOverride = trim(import.meta.env.VITE_API_BASE_URL);

/** Empty in production same-origin mode; set when API is on another host. */
export const API_BASE_URL =
  apiBaseOverride || (isDev ? devHttpBase() : "");

/** Relative `/api` when same-origin; absolute when `VITE_API_BASE_URL` is set. */
export const API_PREFIX =
  trim(import.meta.env.VITE_API_PREFIX) ||
  (API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/api` : "/api");

export const ADMIN_LOGIN_API_URL =
  trim(import.meta.env.VITE_ADMIN_LOGIN_API_URL) ||
  `${API_PREFIX}/auth/login/`;

export const ADMIN_LOGIN_PATH =
  trim(import.meta.env.VITE_ADMIN_LOGIN_PATH) || "/ops-gate-7f3x-enter";

export const ADMIN_DASHBOARD_PATH =
  trim(import.meta.env.VITE_ADMIN_DASHBOARD_PATH) || "/ops-gate-7f3x-console";

function defaultWsUrl() {
  if (isDev) {
    return `ws://${window.location.hostname}:8000/ws/chat/`;
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/chat/`;
}

export const WS_URL = trim(import.meta.env.VITE_WS_URL) || defaultWsUrl();

export const TURNSTILE_SITE_KEY = trim(import.meta.env.VITE_TURNSTILE_SITE_KEY);

export const TURNSTILE_ENABLED =
  import.meta.env.VITE_TURNSTILE_ENABLED !== "false" &&
  TURNSTILE_SITE_KEY.length > 0;
