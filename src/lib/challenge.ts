/**
 * 30 Site Challenge — what the home section lists.
 *
 * The sites themselves live in a separate repo (usukh6ayar/challenge) and
 * deploy to challenge.usukhbayar.dev, so an experiment can never break the
 * page that takes orders. This file only records what is live and where.
 *
 * To list a new site once it is deployed:
 *   1. add an entry below (n, slug, tech)
 *   2. add `challenge.sites.<slug>` { title, tagline } to both message files
 *   3. put a 4:5 poster at /public/challenge/<slug>.jpg and, optionally,
 *      a short muted loop at /public/challenge/<slug>.mp4
 */

export const CHALLENGE_TOTAL = 30;
export const CHALLENGE_ORIGIN = "https://challenge.usukhbayar.dev";

export type ChallengeSite = {
  slug: string;
  /** Position in the series, 1–30 */
  n: number;
  tech: string[];
  /** Override when a site lives somewhere other than CHALLENGE_ORIGIN/<slug> */
  url?: string;
  /** /public paths; default to /challenge/<slug>.jpg and no video */
  poster?: string;
  reel?: string;
};

export const CHALLENGE_SITES: ChallengeSite[] = [
  { slug: "mdent", n: 3, tech: ["Next.js", "GSAP", "Lenis", "TypeScript"] },
];

export const LIVE_SITES = [...CHALLENGE_SITES].sort((a, b) => a.n - b.n);

export function challengeUrl(site: ChallengeSite): string {
  return site.url ?? `${CHALLENGE_ORIGIN}/${site.slug}`;
}

export function challengePoster(site: ChallengeSite): string {
  return site.poster ?? `/challenge/${site.slug}.jpg`;
}

export function formatSiteNumber(n: number): string {
  return String(n).padStart(2, "0");
}
