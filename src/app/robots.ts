import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/lib/site-url";

// Indexation ouverte (`NEXT_PUBLIC_ALLOW_INDEXING=true`, porte de maintenance
// levée, contexte Netlify `production`) : tout est ouvert, avec le plan du site.
// Partout ailleurs (local, deploy previews, porte posée) : `Disallow: /`.

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
