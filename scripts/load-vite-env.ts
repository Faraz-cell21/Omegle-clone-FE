import { resolve } from "node:path";
import { loadEnv } from "vite";

const root = resolve(import.meta.dirname, "..");

/** Same env loading as Vite: `.env` + `.env.[mode]` (e.g. `.env.production`). */
export function loadViteEnv(mode = process.env.MODE ?? "development") {
  return loadEnv(mode, root, "");
}
