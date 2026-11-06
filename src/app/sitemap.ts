import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/api/properties";
import { getSiteUrl } from "@/lib/seo/metadata";

// Plan du site (doc 04 §4.4) : les 9 pages fixes, puis chaque fiche visible.
// Si l'API est indisponible, le plan sort quand même avec les pages fixes.

const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/biens", priority: 0.9 },
  { path: "/vendre", priority: 0.8 },
  { path: "/vendre/estimation", priority: 0.8 },
  { path: "/le-cabinet", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/honoraires", priority: 0.5 },
  { path: "/mentions-legales", priority: 0.1 },
  { path: "/confidentialite", priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Porte de maintenance posée (`src/proxy.ts`) : plan vide, comme sur main.
  // `sitemap.xml` échappe au proxy, il ne doit rien dévoiler du site fermé.
  if (process.env.MAINTENANCE_MODE === "on") return [];
  const base = getSiteUrl();
  const url = (path: string) => new URL(path, base).toString();

  const pages: MetadataRoute.Sitemap = PAGES.map(({ path, priority }) => ({
    url: url(path),
    priority,
  }));

  let listings: MetadataRoute.Sitemap = [];
  try {
    const properties = await getProperties();
    listings = properties.map((p) => ({
      url: url(`/biens/${encodeURIComponent(p.reference)}`),
      lastModified: p.updatedAt ?? p.createdAt,
      priority: 0.8,
    }));
  } catch {
    listings = [];
  }

  return [...pages, ...listings];
}
