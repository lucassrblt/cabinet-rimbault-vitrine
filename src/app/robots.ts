import type { MetadataRoute } from "next";
import { isPreviewDeploy } from "@/lib/deploy-context";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://cabinet-rimbault.fr";

export default function robots(): MetadataRoute.Robots {
  // Gate de maintenance actif → bloquer toute indexation.
  if (process.env.MAINTENANCE_MODE === "on") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  // Preview : crawlable (agents/LLM) mais noindex via X-Robots-Tag + meta.
  // Pas de sitemap : il pointerait vers le domaine de production.
  if (isPreviewDeploy) {
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
