import type { NextConfig } from "next";

const isSitesExport = process.env.SITES_EXPORT === "1";

const nextConfig: NextConfig = {
  // Keep the normal optimized Vercel build, with an explicit static export
  // path for owner-only preview publishing through Sites.
  output: isSitesExport ? "export" : undefined,
  images: {
    unoptimized: isSitesExport,
    // Next 16 allows only the qualities listed here, and defaults to [75].
    // Product screenshots are dense text on flat UI: 75 is where the labels in
    // a dashboard start to smear, which is the one thing these shots exist to
    // show. 90 is the delivery pass for those; 75 stays for photographic art.
    qualities: [75, 90],
  },
};

export default nextConfig;
