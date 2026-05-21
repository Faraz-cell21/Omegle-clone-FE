/** Routes included in sitemap and prerendered at build time. */
export const PUBLIC_ROUTES = ["/", "/privacy", "/terms"] as const;

export const SITEMAP_ENTRIES: {
  path: (typeof PUBLIC_ROUTES)[number];
  changefreq: string;
  priority: string;
}[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/privacy", changefreq: "monthly", priority: "0.5" },
  { path: "/terms", changefreq: "monthly", priority: "0.5" },
];
