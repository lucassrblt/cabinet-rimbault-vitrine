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
  // Bascule vers la Galerie : anciennes adresses (liens déjà partagés).
  // Temporaires tant que l'arborescence n'est pas figée.
  async redirects() {
    return [
      // Adresses du site de main (audit du site en ligne, §3.1). La
      // redirection garde la requête (`/acheter?commune=…`).
      { source: "/acheter", destination: "/biens", permanent: false },
      // La Galerie n'a pas de page Louer : la salle liste aussi les locations.
      { source: "/louer", destination: "/biens", permanent: false },
      {
        source: "/bien/:reference",
        destination: "/biens/:reference",
        permanent: false,
      },
      { source: "/agence", destination: "/le-cabinet", permanent: false },
      {
        source: "/politique-de-confidentialite",
        destination: "/confidentialite",
        permanent: false,
      },
      {
        source: "/cookies",
        destination: "/confidentialite#cookies",
        permanent: false,
      },
      // Le tunnel d'estimation vit désormais sous Vendre.
      {
        source: "/estimation",
        destination: "/vendre/estimation",
        permanent: false,
      },
      // Banc de démonstration `/galerie/...` devenu le site principal.
      // `/galerie` seul : règle explicite (avec `:path*` vide, l'adresse de
      // destination sortirait vide).
      { source: "/galerie", destination: "/", permanent: false },
      { source: "/galerie/:path+", destination: "/:path+", permanent: false },
    ];
  },
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
