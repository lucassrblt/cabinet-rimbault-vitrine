import type { MetadataRoute } from "next";

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
