import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/SeaGuard',
  assetPrefix: '/SeaGuard/',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
