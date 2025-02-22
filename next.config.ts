import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "pub-ef320d20923b471ab8d31ed51a2ea3c3.r2.dev",
      },
    ],
  },
};

export default nextConfig;
