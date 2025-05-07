import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    authInterrupts: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 500,
      aggregateTimeout: 100,
      ignored: ["**/.next/**", "**/node_modules/**"],
    };
    return config;
  },
};

export default nextConfig;
