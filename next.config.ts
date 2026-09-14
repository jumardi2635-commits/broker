import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Next.js 16.3 Turbopack has a regression where `standalone` output fails
  // to emit `next-server.js.nft.json` when a platform adapter (e.g. Vercel)
  // is detected. Only use standalone output for self-hosted/Docker builds.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
