@AGENTS.md

# Portfolio — usukhbayar.dev

The page that wins web-dev orders from Mongolian businesses. Mongolian is the default locale; English is one tap away.

## Where things live
- All visible copy: `messages/mn.json` and `messages/en.json`. Change both, keeping the same keys.
- Non-copy config (email, phone, socials, nav): `src/lib/constants.ts`.
- Design system "Acid Signal": dark only, lime accent `#B8F300`, sparse violet. Use the tokens in `src/app/globals.css`, not literal colors.
- Section reveals follow one pattern (GSAP + `gsap.context`, `opacity-0` only when motion is allowed). Copy an existing section such as `Services.tsx`.

## Challenge
The sites live in a **separate repo**, `usukh6ayar/challenge`, served at `challenge.usukhbayar.dev/<slug>`. Don't build challenge sites in this repo. This repo only lists them.

To list a site after it goes live:
1. Add one entry to `CHALLENGE_SITES` in `src/lib/challenge.ts` (slug, MN/EN title, business type, tagline, tech). Order is release order; the `#01` numbering and the "N sites shipped" counter come from it.
2. Put a 4:5 poster at `public/challenge/<slug>.jpg`. An optional short muted loop goes at `public/challenge/<slug>.mp4`; set `reel` for it.
3. Run `npm run lint`, `npx tsc --noEmit` and `npm run build`.

The home page shows the Challenge section (and its nav link) only once there are `MIN_CHALLENGE_ENTRIES` (3) published sites. Below that, the newest site appears as a "Latest work" card under the projects (`LatestWork.tsx`).

## Before pushing
- `npm run lint`, `npx tsc --noEmit` and `npm run build` all pass.
- A static export must also build: `SITES_EXPORT=1 npm run build`.
