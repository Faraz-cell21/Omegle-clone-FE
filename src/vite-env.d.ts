/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_PREFIX?: string;
  readonly VITE_ADMIN_LOGIN_API_URL?: string;
  readonly VITE_ADMIN_LOGIN_PATH?: string;
  readonly VITE_ADMIN_DASHBOARD_PATH?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_TURNSTILE_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
