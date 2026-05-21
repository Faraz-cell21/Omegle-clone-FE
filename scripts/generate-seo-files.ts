/**
 * Writes public/robots.txt and public/sitemap.xml from VITE_SITE_URL.
 * Run before build: bun run seo:generate
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const siteUrl = (process.env.VITE_SITE_URL ?? "https://yourdomain.com").replace(
  /\/$/,
  "",
);

/** Paths that should be indexed (add /privacy, /terms when those pages exist). */
const SITEMAP_PATHS: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
];

const DISALLOW_PATHS = [
  "/ops-gate-7f3x-enter",
  "/ops-gate-7f3x-console",
  "/chat",
  "/waiting",
  "/reconnecting",
  "/banned",
];

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_PATHS.map(
  ({ path, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${path === "/" ? "/" : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
${DISALLOW_PATHS.map((p) => `Disallow: ${p}`).join("\n")}

Sitemap: ${siteUrl}/sitemap.xml
`;

const publicDir = resolve(import.meta.dirname, "../public");
writeFileSync(resolve(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(resolve(publicDir, "robots.txt"), robots, "utf8");

console.log(`SEO files generated for ${siteUrl}`);
console.log("  public/sitemap.xml");
console.log("  public/robots.txt");
