import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hangout-user-media-prod.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
