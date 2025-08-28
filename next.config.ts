import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/frictionlearn',
  assetPrefix: '/frictionlearn/',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
