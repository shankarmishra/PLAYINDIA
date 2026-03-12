import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Yeh add karna zaroori hai Static Site ke liye
  reactCompiler: true,
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  images: {
    unoptimized: true, // Static export mein images ke liye yeh chahiye hota hai
  },
};

export default nextConfig;
