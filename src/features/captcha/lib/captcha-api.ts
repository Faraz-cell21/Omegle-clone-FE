import { API_PREFIX } from "~/config";

export interface CaptchaVerifyResponse {
  validity: boolean;
  message: string;
  expires_in?: number;
}

function extractErrorMessage(data: unknown, status: number) {
  if (typeof data === "object" && data !== null) {
    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
    if ("detail" in data && typeof data.detail === "string") {
      return data.detail;
    }
  }
  return `Request failed with status ${status}`;
}

export async function verifyCaptcha(turnstileToken: string) {
  const response = await fetch(`${API_PREFIX}/captcha/verify/`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ turnstile_token: turnstileToken }),
  });

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, response.status));
  }

  return data as CaptchaVerifyResponse;
}
