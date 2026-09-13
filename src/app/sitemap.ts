import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { ALL_PROJECT_IDS } from "@/lib/projects";

/** Three routes, generated from the registry so a new project appears here. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...ALL_PROJECT_IDS.map((id) => ({
      url: `${SITE.url}/work/${id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
