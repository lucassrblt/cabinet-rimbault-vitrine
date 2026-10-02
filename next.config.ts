import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
