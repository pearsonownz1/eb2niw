import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/guide", destination: "/resources", permanent: false },
      { source: "/quiz", destination: "/eligibility", permanent: false },
      { source: "/start", destination: "/eligibility", permanent: false },
      { source: "/services", destination: "/pricing", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
