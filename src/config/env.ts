export const WS_URL = import.meta.env.DEV
  ? `ws://${window.location.hostname}:8000/ws/chat/`
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws/chat/`;

const DEFAULT_HTTP_API_BASE = import.meta.env.DEV
  ? `${window.location.protocol === "https:" ? "https:" : "http:"}//${window.location.hostname}:8000`
  : window.location.origin;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_HTTP_API_BASE;

// JWT login alias (must be before Django admin in backend urls).
export const ADMIN_LOGIN_API_URL =
  import.meta.env.VITE_ADMIN_LOGIN_API_URL?.trim() ||
  (import.meta.env.DEV ? "/admin/login/" : `${API_BASE_URL}/admin/login/`);

// Dashboard, logout, soft-ban live under /api/ on the backend.
export const API_PREFIX =
  import.meta.env.VITE_API_PREFIX?.trim() ||
  (import.meta.env.DEV ? "/api" : `${API_BASE_URL}/api`);

export const ADMIN_LOGIN_PATH =
  import.meta.env.VITE_ADMIN_LOGIN_PATH?.trim() || "/ops-gate-7f3x-enter";

export const ADMIN_DASHBOARD_PATH =
  import.meta.env.VITE_ADMIN_DASHBOARD_PATH?.trim() || "/ops-gate-7f3x-console";

export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || "";

export const TURNSTILE_ENABLED =
  import.meta.env.VITE_TURNSTILE_ENABLED !== "false" && !!TURNSTILE_SITE_KEY;
