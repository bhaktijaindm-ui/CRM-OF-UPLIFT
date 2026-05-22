import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/CRM-OF-UPLIFT',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
