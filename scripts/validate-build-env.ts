/**
 * Fails production builds if required env vars are missing or still placeholders.
 * Invoked from `bun run build` before seo:generate.
 */

import { loadViteEnv } from "./load-vite-env";

const PLACEHOLDER_HOSTS = ["yourdomain.com", "example.com", "localhost"];

const mode = process.env.MODE ?? "production";
const env = loadViteEnv(mode);

const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/$/, "");
let failed = false;

function fail(message: string) {
  console.error(`[build] ${message}`);
  failed = true;
}

if (!siteUrl) {
  fail("VITE_SITE_URL is required. Copy .env.production.example to .env.production.");
} else {
  try {
    const host = new URL(siteUrl).hostname;
    if (PLACEHOLDER_HOSTS.includes(host)) {
      fail(
        `VITE_SITE_URL must be your real domain (got ${siteUrl}). Update .env.production before building.`,
      );
    }
    if (siteUrl.startsWith("http://") && !host.includes("localhost")) {
      console.warn(
        "[build] VITE_SITE_URL uses http:// — use https:// for production SEO and OG tags.",
      );
    }
  } catch {
    fail(`VITE_SITE_URL is not a valid URL: ${siteUrl}`);
  }
}

const turnstileEnabled = env.VITE_TURNSTILE_ENABLED !== "false";
if (turnstileEnabled && !env.VITE_TURNSTILE_SITE_KEY?.trim()) {
  fail(
    "VITE_TURNSTILE_SITE_KEY is required when Turnstile is enabled. Set production keys from Cloudflare.",
  );
}

if (failed) {
  process.exit(1);
}

console.log(`[build] env OK (mode=${mode}, site=${siteUrl})`);
