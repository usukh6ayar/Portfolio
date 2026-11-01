/**
 * 30 Site Challenge — the registry.
 *
 * Structure only (slug, order, status, tech, media). Copy lives in
 * messages/*.json under `challenge.sites.<slug>`; the component for each slug
 * is mapped in src/challenge/components.tsx.
 *
 * To ship a new site:
 *   1. copy src/challenge/sites/starter → src/challenge/sites/<slug>
 *   2. add it to src/challenge/components.tsx
 *   3. add `challenge.sites.<slug>` (title, tagline) to both message files
 *   4. add an entry below with status "draft"; flip to "live" when posting
 *   5. drop the reel in /public/challenge/<slug>.mp4 and a poster .jpg
 */

export const CHALLENGE_TOTAL = 30;

export type ChallengeStatus = "draft" | "live";

export type ChallengeSite = {
  slug: string;
  /** Position in the series, 1–30. 0 = internal starter. */
  n: number;
  status: ChallengeStatus;
  tech: string[];
  /** Optional /public paths for the home grid */
  reel?: string;
  poster?: string;
};

export const CHALLENGE_SITES: ChallengeSite[] = [
  {
    slug: "starter",
    n: 0,
    status: "draft",
    tech: ["Next.js", "R3F", "GSAP", "Lenis"],
  },
];

export const LIVE_SITES = CHALLENGE_SITES.filter(
  (site) => site.status === "live",
).sort((a, b) => a.n - b.n);

/** The template site; always built so the route never has zero pages. */
export const STARTER_SLUG = "starter";

/**
 * Drafts are reachable in development only, so work in progress never ships.
 * The starter is the exception: a static export refuses a dynamic route with
 * no pages, so it is always built, and kept out of search (see the page).
 */
export const ROUTABLE_SITES =
  process.env.NODE_ENV === "production"
    ? CHALLENGE_SITES.filter(
        (site) => site.status === "live" || site.slug === STARTER_SLUG,
      )
    : CHALLENGE_SITES;

export function getChallengeSite(slug: string): ChallengeSite | undefined {
  return ROUTABLE_SITES.find((site) => site.slug === slug);
}

export function challengeHref(slug: string): string {
  return `/challenge/${slug}`;
}

export function formatSiteNumber(n: number): string {
  return String(n).padStart(2, "0");
}
