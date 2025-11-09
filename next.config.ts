import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "first-sockeye-617.convex.cloud",
      },
    ],
  },
};

export default nextConfig;