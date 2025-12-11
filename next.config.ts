import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  reactCompiler: true,
  // Basic TypeScript configuration
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  images: {
    // Allow loading images from GitHub avatars
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
    ],
  },
};

export default nextConfig;
