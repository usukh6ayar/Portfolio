@AGENTS.md

# Portfolio — usukhbayar.dev

The page that wins web-dev orders from Mongolian businesses. Mongolian is the default locale; English is one tap away.

## Where things live
- All visible copy: `messages/mn.json` and `messages/en.json`. Change both, keeping the same keys.
- Non-copy config (email, phone, socials, nav): `src/lib/constants.ts`.
- Design system "Acid Signal": dark only, lime accent `#B8F300`, sparse violet. Use the tokens in `src/app/globals.css`, not literal colors.
- Section reveals follow one pattern (GSAP + `gsap.context`, `opacity-0` only when motion is allowed). Copy an existing section such as `Services.tsx`.

## 30 Site Challenge
The sites live in a **separate repo**, `usukh6ayar/challenge`, served at `challenge.usukhbayar.dev/<slug>`. Don't build challenge sites in this repo. This repo only lists them in the Challenge section (`src/components/sections/Challenge.tsx`).

To list a site after it goes live:
1. Add `{ slug, n, tech }` to `CHALLENGE_SITES` in `src/lib/challenge.ts`.
2. Add `challenge.sites.<slug>` with `title` and `tagline` to both message files.
3. Put a 4:5 poster at `public/challenge/<slug>.jpg`. An optional short muted loop goes at `public/challenge/<slug>.mp4`; set `reel` for it.
4. Run `npm run lint`, `npx tsc --noEmit` and `npm run build`.

The meter and the "00/30" counter update from the registry. Nothing else needs to change.

## Before pushing
- `npm run lint`, `npx tsc --noEmit` and `npm run build` all pass.
- A static export must also build: `SITES_EXPORT=1 npm run build`.
