import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Basic TypeScript configuration
  typescript: {
    tsconfigPath: "./tsconfig.json"
  }
};

export default nextConfig;
