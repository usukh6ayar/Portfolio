# Usukhbayar — Full-Stack Developer & Team Lead Portfolio

Bilingual (EN / MN) personal portfolio for a full-stack developer and team lead who builds web and mobile products end to end, from architecture through production. Built as a dark, editorial product presentation — not a template resume site.

**Live:** [usukhbayar.dev](https://usukhbayar.dev) · **Repository:** [github.com/usukh6ayar/Portfolio](https://github.com/usukh6ayar/Portfolio)

---

## Preview

```text
<!-- Add a real homepage capture when ready, e.g.:
![Portfolio homepage](docs/preview.png)
-->
```

No homepage capture for this README is checked in yet. The site itself shows real product screenshots — see [Project Content](#project-content).

---

## About the Project

This site presents Usukhbayar as a full-stack developer and team lead who ships real software. The home page is a single continuous narrative — proof first, then the record behind it, then what a client can hire for, then the person:

**Hero → Featured work → Selected work → Experience → Services → Process → About → Capabilities → Contact**

[NomadKids](/work/nomadkids) is the featured project and [SparkXP](/work/sparkxp) follows it. Both are products led at Aether Tech Core; the Experience section keeps that employment separate from the work itself. Each project is shown as a reel of its real product surfaces, with deeper context on dedicated case study routes.

---

## Design Direction

**Acid Signal** — a refined dark system built for product craft, not decoration.

| Role | Choice |
|------|--------|
| Foundation | Near-black (`#0A0A0A`) surfaces |
| Accent | Soft acid lime (`#B8F300`) |
| Secondary | Sparse violet (`#A78BFA`) |
| Hierarchy | Typography-led (display + body + mono) |
| Motion | Restrained, intentional, interruptible |
| Mode | Dark-only |

Presentation is editorial: clear chapter structure, generous spacing, product screens as first-class media surfaces. Motion supports reading and navigation — it does not compete with content.

**Type stack:** Clash Display (Latin display) · Manrope (Cyrillic display fallback) · Inter (UI/body) · JetBrains Mono (labels, meta).

---

## Built With

### Core

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4

### Motion

- [GSAP](https://gsap.com/) + ScrollTrigger
- [Framer Motion](https://www.framer.com/motion/)
- [Lenis](https://github.com/darkroomengineering/lenis)

### 3D

- [three.js](https://threejs.org/) with [React Three Fiber](https://r3f.docs.pmnd.rs/) and [drei](https://drei.docs.pmnd.rs/) — two lazy-loaded scenes (see [Key Features](#key-features))

### Experience

- [next-intl](https://next-intl.dev/) (client locale, no `/en` · `/mn` routes)

---

## Key Features

Implemented and present in the codebase:

| Feature | Notes |
|---------|--------|
| EN / MN localization | Client switch; messages in `messages/en.json` and `messages/mn.json` |
| Editorial single-page narrative | Home story with section bridges before Services and Contact |
| Work reel | Each project's surfaces shown one at a time at readable size. Fine-pointer desktops pin the scene and scroll through it; touch, short screens and reduced motion get a native swipe strip |
| Case study routes | Static `/work/[slug]` pages for each registered project, with a filterable screenshot gallery and lightbox |
| 404 page | Spark searches for the missing page, watches the pointer when it moves, and the page names the address that failed |
| 3D scenes | The name in Mongolian script, extruded and assembling on scroll, in About; the SparkXP buddy avatar (rigged GLB) on its case study. Loaded only near the viewport, and stop drawing when off screen |
| Inquiry form | Project type, budget and timeline; posts to `NEXT_PUBLIC_FORM_ENDPOINT` when set, otherwise composes a `mailto:` |
| Session-only preloader | Full 000–100 sequence once per browser session |
| Custom cursor | Fine-pointer devices only; transform-only tracking |
| Magnetic CTAs | Subtle pull on fine-pointer + motion-OK devices |
| Command palette | `⌘K` / `Ctrl+K`; lazy-mounted until first open |
| Lenis smooth scrolling | Synchronized with GSAP ScrollTrigger |
| GSAP scroll reveals | Entrance animations with cleanup via `gsap.context` |
| Reduced motion | Lenis, cursor, and theatrical motion skip initialization |
| Mobile-aware systems | Coarse pointer: no custom cursor, no magnetic, no pinned scenes, simplified scroll FX; sticky "Start a project" bar |
| Scroll progress | Top progress bar (transform-only) |
| Sticky navigation | Editorial nav + language toggle (target locale only) |
| SEO | Metadata, generated Open Graph images (site + per case study), `sitemap.xml`, `robots.txt`, `Person` and `ProfessionalService` JSON-LD |

---

## Architecture

Hybrid model:

1. **Home** — one continuous portfolio narrative (`src/app/page.tsx`)
2. **Case studies** — dedicated routes under `src/app/work/[slug]` with static params from the project registry

```text
Portfolio/
├── messages/                 # en.json · mn.json (all UI copy)
├── public/
│   ├── images/               # portrait + work screenshots
│   └── models/               # spark-fox.glb (SparkXP buddy avatar)
├── src/
│   ├── app/                  # App Router (layout, home, work/[slug], OG, sitemap, robots)
│   ├── components/
│   │   ├── contact/          # Inquiry form
│   │   ├── layout/           # Nav, preloader, bridges, scroll progress, sticky CTA
│   │   ├── providers/        # i18n, Lenis, app shell, page transition
│   │   ├── sections/         # Hero → Contact home chapters
│   │   ├── ui/               # Cursor, command palette, magnetic button, 3D type…
│   │   └── work/             # Work reel, case study view, gallery, buddy avatar
│   ├── fonts/                # Clash Display (local woff2)
│   ├── hooks/                # useMediaQuery, useReducedMotion, useInView
│   └── lib/                  # constants, projects, experience, fonts, i18n helpers
└── package.json
```

**Project registry** (`src/lib/projects.ts`) owns structure (ids, routes, gallery, reel, links, tone). **Employment registry** (`src/lib/experience.ts`) owns roles. **Copy** lives only in message files. **Non-copy site config** (email, social hrefs, portrait) lives in `src/lib/constants.ts`.

### Registered work

| ID | Route | Role |
|----|--------|------|
| `nomadkids` | `/work/nomadkids` | Featured |
| `sparkxp` | `/work/sparkxp` | Selected |

---

## Performance & Accessibility

Documented choices in the current implementation (not measured Lighthouse claims):

- **`prefers-reduced-motion`** — Lenis and custom cursor do not initialize; scroll systems use instant/simplified paths; the work reel does not pin; 3D scenes render a single still frame
- **Coarse pointer / touch** — custom cursor and magnetic interactions never attach; pinned and scrubbed scenes are replaced with native scrolling or one-shot reveals
- **Cursor tracking** — refs and direct transform writes; no React state per pointermove
- **Animation cleanup** — GSAP contexts and ScrollTriggers reverted on unmount; pinned scenes re-measure on language switch
- **3D** — three.js bundles are dynamically imported, mounted only near the viewport, and render on demand once scrolled away
- **Images** — `next/image` with aspect-ratio containers. Work-reel screenshots go through the image optimizer (`qualities: [75, 90]`); the case-study gallery serves the original files
- **Keyboard** — command palette (`⌘K` / `Ctrl+K`, Escape); native `<dialog>` lightbox with focus return; focus-visible styles in global CSS
- **Session preloader** — does not replay on internal navigation or return visits within the same session

---

## Getting Started

### Prerequisites

- Node.js 20.9+ (required by Next.js 16)
- npm (lockfile: `package-lock.json`)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

### Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_FORM_ENDPOINT` | Optional. Formspree (or equivalent) URL for the inquiry form; without it the form opens a pre-filled email |
| `SITES_EXPORT=1` | Optional. Builds a static export with unoptimized images, for preview publishing |

---

## Localization

| Locale | File | Default |
|--------|------|---------|
| English | `messages/en.json` | Yes |
| Mongolian | `messages/mn.json` | — |

Locale is **client-side only** — no `/en` or `/mn` URL segments. Preference resolution:

1. `localStorage` key `portfolio-locale`
2. Browser language (`mn` → Mongolian, else English)
3. Fallback: `en`

Switching language updates `document.documentElement.lang`, persists preference, and re-renders copy without a full navigation. Cyrillic display support is provided by Manrope alongside Clash Display for Latin headlines.

---

## Project Content

| Concern | Source |
|---------|--------|
| UI / story copy | `messages/en.json`, `messages/mn.json` |
| Project ids, routes, gallery, reel, links | `src/lib/projects.ts` |
| Employment history | `src/lib/experience.ts` + `experience.roles` in messages |
| Site URL, email, socials, portrait | `src/lib/constants.ts` |
| Case study pages | `src/app/work/[slug]/page.tsx` + `CaseStudyView` |
| Work screenshots | `public/images/work/` — 5 NomadKids role dashboards, 7 SparkXP shots (mobile app, landing page, admin) |
| Portrait | `PORTRAIT` in constants → `public/images/portrait.jpg` |

To add a screenshot:

1. Place it under `public/images/work/`. Phone captures need `-mobile-` in the filename.
2. Add it to the project's `gallery` in `src/lib/projects.ts`, with its `surface`.
3. Add a caption to `work.gallery.captions` in both message files, keyed by the filename without extension.
4. To show it on the home page, add its `src` to the project's `reel`. Reel captions come from `work.caseStudy.<id>.roles` (matched by surface) or `work.reel.<id>.<surface>`.

---

## Status

**Live and complete** — design system, i18n, motion systems, home story, work reel, case study routes with real product screenshots, inquiry form, command palette, and performance-aware interaction layers.

**Still open:**

- Inquiry form delivery: `NEXT_PUBLIC_FORM_ENDPOINT` unset means submissions open the visitor's email client
- No LinkedIn link: copy keys exist in the message files, but `SOCIAL_ITEMS` lists GitHub, Instagram and email only
- NomadKids mobile app: shown as "In development" on its case study, with no screenshots yet

**Hosting:** Vercel. `https://usukhbayar.dev` (`SITE.url`) is the canonical apex domain; `www` 308-redirects to it.

---

## Author

**Usukhbayar**  
Full-Stack Developer & Team Lead  
Ulaanbaatar, Mongolia

- GitHub: [github.com/usukh6ayar](https://github.com/usukh6ayar)
- Instagram: [instagram.com/usukh6ayar](https://instagram.com/usukh6ayar)
- Repository: [github.com/usukh6ayar/Portfolio](https://github.com/usukh6ayar/Portfolio)

---

## License

No open-source license file is included.

This is a personal portfolio. All rights reserved unless a separate license is added later. Do not reuse branding, copy, or project case content without permission.
