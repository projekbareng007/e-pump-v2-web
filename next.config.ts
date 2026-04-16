import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy /api/proxy/* → backend (used by Next.js dev server and production)
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
