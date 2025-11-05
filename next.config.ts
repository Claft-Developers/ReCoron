import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/docs/:slug.md",
        destination: "/docs/:slug",
        permanent: true,
      }
    ]
  },
};

export default nextConfig;
