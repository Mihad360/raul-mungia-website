import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "mihad8080.merinasib.shop" },
      { protocol: "https", hostname: "api.stxresearch.com" },
    ],
  },
};

export default nextConfig;
