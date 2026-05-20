import { ADMIN_LOGIN_API_URL, API_PREFIX } from "~/config/env";
import { clearAdminToken, getAdminToken, setAdminToken } from "./admin-auth";
import type {
  AdminDashboardResponse,
  AdminLoginPayload,
  AdminLoginResponse,
  SoftBanPayload,
} from "../models/admin.models";

type RequestOptions = RequestInit & { auth?: boolean };

function extractErrorMessage(data: unknown, status: number) {
  if (typeof data === "object" && data !== null) {
    if ("detail" in data && typeof data.detail === "string") {
      return data.detail;
    }
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
  }
  return `Request failed with status ${status}`;
}

function pickAccessToken(data: AdminLoginResponse) {
  const token = data.access_token;
  if (!token) {
    throw new Error("Login response missing access token.");
  }
  return token;
}

async function request<T>(url: string, init?: RequestOptions): Promise<T> {
  const useAuth = init?.auth !== false;
  const token = useAuth ? getAdminToken() : null;
  const { auth: _auth, ...fetchInit } = init ?? {};

  let response: Response;
  try {
    response = await fetch(url, {
      credentials: "include",
      redirect: "manual",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchInit.headers ?? {}),
      },
      ...fetchInit,
    });
  } catch {
    throw new Error(
      "Network error — could not reach the admin API. Restart the dev server if you just changed proxy settings.",
    );
  }

  if (response.status >= 300 && response.status < 400) {
    throw new Error("Session expired. Please sign in again.");
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { detail: text };
    }
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, response.status));
  }

  return data as T;
}

export async function adminLogin(payload: AdminLoginPayload) {
  const data = await request<AdminLoginResponse>(ADMIN_LOGIN_API_URL, {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
  setAdminToken(pickAccessToken(data));
  return data;
}

export async function adminLogout() {
  try {
    await request<Record<string, unknown>>(`${API_PREFIX}/auth/logout/`, {
      method: "POST",
    });
  } finally {
    clearAdminToken();
  }
}

export async function fetchAdminDashboard() {
  return request<AdminDashboardResponse>(`${API_PREFIX}/admin/dashboard/`, {
    method: "GET",
  });
}

export async function createSoftBan(payload: SoftBanPayload) {
  return request<Record<string, unknown>>(`${API_PREFIX}/admin/soft-ban/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
