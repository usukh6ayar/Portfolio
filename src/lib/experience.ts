/**
 * Employment registry — structure only.
 * Copy: messages/*.json → experience.roles.<id>
 *
 * Most recent first. Only roles that were actual employment belong here; a
 * personal project is not a job, and the work itself is already on the page.
 */

import type { Locale } from "@/lib/i18n/settings";

export const EXPERIENCE_ORDER = ["aether", "nomin"] as const;

export type ExperienceId = (typeof EXPERIENCE_ORDER)[number];

export type ExperienceMeta = {
  id: ExperienceId;
  /** Company site, when there is one a visitor can actually open. */
  href?: string;
  /** Rendered more prominently — the role a client is hiring off. */
  current?: boolean;
  /**
   * One line on what the work achieved, in both locales. Hidden while empty;
   * only real, checkable outcomes belong here.
   */
  result?: Record<Locale, string>;
};

export const EXPERIENCE: Record<ExperienceId, ExperienceMeta> = {
  aether: {
    id: "aether",
    href: "https://aethertech.mn/",
    current: true,
  },
  nomin: {
    id: "nomin",
    // TODO(usukh): a real outcome of the HSE module work, e.g. how many
    // employees used it or what it replaced. Leave empty to keep it hidden.
    result: { mn: "", en: "" },
  },
};
