import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexable } from "@/lib/seo/metadata";

// Production (`SITE_ENV=production`, porte de maintenance levée) : tout est
// ouvert, avec le plan du site.
// Partout ailleurs (local, préproduction) : rien n'est indexable.

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
