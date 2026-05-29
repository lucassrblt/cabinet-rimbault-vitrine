import type { MetadataRoute } from "next";
import { searchProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://cabinet-rimbault.fr";

const STATIC_ROUTES = [
  "/",
  "/acheter",
  "/louer",
  "/estimation",
  "/agence",
  "/contact",
  "/honoraires",
  "/mentions-legales",
  "/politique-de-confidentialite",
  "/cookies",
];

async function fetchAllProperties(): Promise<Property[]> {
  const PER_PAGE = 100;
  const MAX_PAGES = 20;
  const all: Property[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    try {
      const res = await searchProperties({
        limit: PER_PAGE,
        offset: page * PER_PAGE,
      });
      const data = res.data ?? [];
      all.push(...data);
      const total = res.total ?? all.length;
      if (all.length >= total || data.length === 0) break;
    } catch {
      break;
    }
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Gate de maintenance actif → ne rien exposer aux crawlers.
  if (process.env.MAINTENANCE_MODE === "on") {
    return [];
  }

  const properties = await fetchAllProperties();
  const now = new Date();

  const statics: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const dynamic: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${SITE_URL}/bien/${encodeURIComponent(p.reference)}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...statics, ...dynamic];
}
