const ADMIN_TOKEN_KEY = "vait:admin:access_token";
const ADMIN_EMAIL_KEY = "vait:admin:email";

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminEmail(): string | null {
  return sessionStorage.getItem(ADMIN_EMAIL_KEY);
}

export function setAdminSession(token: string, email: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_EMAIL_KEY, email);
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_EMAIL_KEY);
}
