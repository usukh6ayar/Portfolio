import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { ALL_PROJECT_IDS, PROJECTS } from "@/lib/projects";
import { LIVE_SITES, challengeHref } from "@/lib/challenge";

export const dynamic = "force-static";

/**
 * Generated from the registries so a new project or challenge site appears here.
 * Paths come off `PROJECTS[id].href` — the same value the case study declares
 * as its canonical, so the two cannot disagree about a URL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...ALL_PROJECT_IDS.map((id) => ({
      url: `${SITE.url}${PROJECTS[id].href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...LIVE_SITES.map((site) => ({
      url: `${SITE.url}${challengeHref(site.slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
