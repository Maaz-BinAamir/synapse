import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "good-monitor-134.convex.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "https://impressive-egret-406.convex.cloud",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
