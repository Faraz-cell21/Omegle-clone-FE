/**
 * Post-build: snapshot HTML for /, /privacy, /terms into dist/.
 * Requires: bun run build (vite) first.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import puppeteer from "puppeteer";
import { PUBLIC_ROUTES } from "../seo.config";

const distDir = resolve(import.meta.dirname, "../dist");
const previewPort = 4173;
const previewOrigin = `http://127.0.0.1:${previewPort}`;
const ROUTE_WAIT_SELECTOR: Record<string, string> = {
  "/": "h1",
  "/privacy": "h1",
  "/terms": "h1",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startPreview(): ChildProcess {
  return spawn("bunx", ["vite", "preview", "--port", String(previewPort), "--strictPort"], {
    cwd: resolve(import.meta.dirname, ".."),
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production" },
  });
}

async function waitForServer(child: ChildProcess) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${previewOrigin}/`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await sleep(500);
    if (child.exitCode !== null) {
      throw new Error("vite preview exited before becoming ready");
    }
  }
  throw new Error("Timed out waiting for vite preview");
}

function outputPathForRoute(route: string) {
  if (route === "/") {
    return resolve(distDir, "index.html");
  }
  const dir = resolve(distDir, route.slice(1));
  mkdirSync(dir, { recursive: true });
  return resolve(dir, "index.html");
}

async function main() {
  const preview = startPreview();
  try {
    await waitForServer(preview);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    for (const route of PUBLIC_ROUTES) {
      const url = `${previewOrigin}${route}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.waitForSelector(ROUTE_WAIT_SELECTOR[route] ?? "h1", {
        timeout: 30_000,
      });
      await sleep(800);
      const html = await page.content();
      const out = outputPathForRoute(route);
      writeFileSync(out, html, "utf8");
      console.log(`Prerendered ${route} → ${out}`);
    }

    await browser.close();
  } finally {
    preview.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
