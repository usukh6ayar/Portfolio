/**
 * Challenge — one interactive site per kind of business.
 *
 * The sites themselves live in a separate repo (usukh6ayar/challenge) and
 * deploy to challenge.usukhbayar.dev, so an experiment can never break the
 * page that takes orders. This file is the only place that lists them:
 * adding a site is one entry below plus its poster in /public/challenge.
 *
 * Numbering comes from array order (#01, #02, …) and the counter from the
 * number of published entries, so neither is ever typed by hand.
 */

import type { Locale } from "@/lib/i18n/settings";

export const CHALLENGE_ORIGIN = "https://challenge.usukhbayar.dev";

/**
 * Below this many published sites the home page shows no Challenge section
 * (and no nav link to it); the latest site appears as a single card under the
 * project work instead. A series of one reads as an abandoned series.
 */
export const MIN_CHALLENGE_ENTRIES = 3;

type Localized = Record<Locale, string>;

export type ChallengeSite = {
  slug: string;
  title: Localized;
  /** The kind of business the site is built for */
  business: Localized;
  tagline: Localized;
  tech: string[];
  /** Set false to keep a finished entry off the page */
  published?: boolean;
  /** Override when a site lives somewhere other than CHALLENGE_ORIGIN/<slug> */
  url?: string;
  /** /public paths; default to /challenge/<slug>.jpg (4:5) and no video */
  poster?: string;
  reel?: string;
};

/** In release order — the first entry is #01. */
export const CHALLENGE_SITES: ChallengeSite[] = [
  {
    slug: "mdent",
    title: { mn: "MDent", en: "MDent" },
    business: { mn: "Шүдний эмнэлэг", en: "Dental clinic" },
    tagline: {
      mn: "Онлайн цаг захиалгатай шүдний эмнэлэг: үйлчилгээ, эмч, сул цаг, календарь.",
      en: "A dental clinic site with online booking: services, doctors, free slots, calendar.",
    },
    tech: ["Next.js", "GSAP", "Lenis", "TypeScript"],
  },
];

export const LIVE_SITES = CHALLENGE_SITES.filter((site) => site.published !== false);

/** Whether the home page shows the Challenge section at all. */
export const SHOW_CHALLENGE = LIVE_SITES.length >= MIN_CHALLENGE_ENTRIES;

/** The most recent published site, for the stand-in card. */
export const LATEST_SITE: ChallengeSite | undefined = LIVE_SITES[LIVE_SITES.length - 1];

export function challengeUrl(site: ChallengeSite): string {
  return site.url ?? `${CHALLENGE_ORIGIN}/${site.slug}`;
}

export function challengePoster(site: ChallengeSite): string {
  return site.poster ?? `/challenge/${site.slug}.jpg`;
}

/** 1 → "01" */
export function formatSiteNumber(n: number): string {
  return String(n).padStart(2, "0");
}

/** A site's number in the series, from its position among published sites. */
export function siteNumber(site: ChallengeSite): string {
  return formatSiteNumber(LIVE_SITES.indexOf(site) + 1);
}
