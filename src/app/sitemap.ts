import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { ALL_PROJECT_IDS, PROJECTS } from "@/lib/projects";

/**
 * Three routes, generated from the registry so a new project appears here.
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
  ];
}
