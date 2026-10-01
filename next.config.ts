import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
