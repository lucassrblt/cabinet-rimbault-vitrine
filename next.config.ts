import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Banc e2e : distDir isolé (.next-e2e) pour ne pas heurter le verrou
  // `<distDir>/lock` d'un autre `next dev` lancé sur le même projet.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Banc e2e en production (E2E_SERVEUR=prod) : contrôle de types du build
  // limité à `src/` (e2e/tsconfig.build.json), pour ne pas lire les types
  // périmés des distDir d'autres agents listés dans tsconfig.json.
  typescript: {
    tsconfigPath: process.env.NEXT_TSCONFIG_PATH || "tsconfig.json",
  },
  // Tests sur téléphone via le réseau local (dev uniquement).
  allowedDevOrigins: ["10.207.238.*", "192.168.*.*"],
  images: {
    remotePatterns: [
      new URL(
        "https://lutylerazlxnfxldziec.supabase.co/storage/v1/object/public/**",
      ),
    ],
    qualities: [75],
  },
};

export default nextConfig;
