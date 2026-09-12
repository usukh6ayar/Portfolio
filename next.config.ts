import type { NextConfig } from "next";

const isSitesExport = process.env.SITES_EXPORT === "1";

const nextConfig: NextConfig = {
  // Keep the normal optimized Vercel build, with an explicit static export
  // path for owner-only preview publishing through Sites.
  output: isSitesExport ? "export" : undefined,
  images: {
    unoptimized: isSitesExport,
  },
};

export default nextConfig;
