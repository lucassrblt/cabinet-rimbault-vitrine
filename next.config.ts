import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Photos de biens immuables tant que le bien existe (URL Supabase par path).
    // Défaut Next = 60 s → ré-optimisation trop fréquente sur fonction Netlify.
    minimumCacheTTL: 2_678_400, // 31 jours
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Photos de profil des auteurs d'avis Google.
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      // Page /vendre temporairement masquée le temps de la retravailler.
      { source: "/vendre", destination: "/estimation", permanent: false },
    ];
  },
};

export default nextConfig;
