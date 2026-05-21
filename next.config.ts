import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Active la View Transitions API de React pour les navigations de route
    // (crossfade de page — cf. (site)/layout.tsx + globals.css).
    viewTransition: true,
  },
  images: {
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
};

export default nextConfig;
