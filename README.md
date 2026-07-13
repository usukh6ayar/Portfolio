# Usukhbayar — Product Engineer Portfolio

Bilingual (EN / MN) personal portfolio for a product engineer focused on frontend and mobile. Built as a dark, editorial product presentation — not a template resume site.

**Repository:** [github.com/usukh6ayar/Portfolio](https://github.com/usukh6ayar/Portfolio)

---

## Preview

```text
<!-- Add a real homepage capture when ready, e.g.:
![Portfolio homepage](docs/preview.png)
-->
```

No production screenshot is checked into the repository yet.

---

## About the Project

This site presents Usukhbayar as a product engineer who designs carefully and ships real software. The home page is a single continuous narrative:

**Hero → About → Flagship product → Selected work → Capabilities → Contact**

[SparkXP](/work/sparkxp) is treated as the flagship product with dedicated visual hierarchy. Secondary projects follow in an editorial alternating layout. Deeper context lives on dedicated case study routes.

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

### Experience

- [next-intl](https://next-intl.dev/) (client locale, no `/en` · `/mn` routes)

---

## Key Features

Implemented and present in the codebase:

| Feature | Notes |
|---------|--------|
| EN / MN localization | Client switch; messages in `messages/en.json` and `messages/mn.json` |
| Editorial single-page narrative | Home story with section bridges between major chapters |
| Case study routes | Static `/work/[slug]` pages for each registered project |
| Session-only preloader | Full 000–100 sequence once per browser session |
| Custom cursor | Fine-pointer devices only; transform tracking via GSAP |
| Magnetic CTAs | Subtle pull on fine-pointer + motion-OK devices |
| Command palette | `⌘K` / `Ctrl+K`; lazy-mounted until first open |
| Lenis smooth scrolling | Synchronized with GSAP ScrollTrigger |
| GSAP scroll reveals | Entrance animations with cleanup via `gsap.context` |
| Reduced motion | Lenis, cursor, and theatrical motion skip initialization |
| Mobile-aware systems | Coarse pointer: no custom cursor, no magnetic, simplified scroll FX |
| Scroll progress | Top progress bar (transform-only) |
| Sticky navigation | Editorial nav + language toggle (target locale only) |

---

## Architecture

Hybrid model:

1. **Home** — one continuous portfolio narrative (`src/app/page.tsx`)
2. **Case studies** — dedicated routes under `src/app/work/[slug]` with static params from the project registry

```text
Portfolio/
├── messages/                 # en.json · mn.json (all UI copy)
├── public/images/            # portrait + work media (when added)
├── src/
│   ├── app/                  # App Router (layout, home, work/[slug])
│   ├── components/
│   │   ├── layout/           # Nav, preloader, bridges, scroll progress
│   │   ├── providers/        # i18n, Lenis, app shell, page transition
│   │   ├── sections/         # Hero → Contact home chapters
│   │   ├── ui/               # Cursor, command palette, magnetic button…
│   │   └── work/             # Case study view + project media
│   ├── fonts/                # Clash Display (local woff2)
│   ├── hooks/                # useMediaQuery, useReducedMotion
│   └── lib/                  # constants, projects, fonts, i18n helpers
└── package.json
```

**Project registry** (`src/lib/projects.ts`) owns structure (ids, routes, media paths, tone). **Copy** lives only in message files. **Non-copy site config** (email, social hrefs, portrait flag) lives in `src/lib/constants.ts`.

### Registered work

| ID | Route | Role |
|----|--------|------|
| `sparkxp` | `/work/sparkxp` | Flagship |
| `beauty-corner` | `/work/beauty-corner` | Selected |
| `qr-menu` | `/work/qr-menu` | Selected |
| `ai-image-studio` | `/work/ai-image-studio` | Selected |

---

## Performance & Accessibility

Documented choices in the current implementation (not measured Lighthouse claims):

- **`prefers-reduced-motion`** — Lenis and custom cursor do not initialize; scroll systems use instant/simplified paths
- **Coarse pointer / touch** — custom cursor and magnetic interactions never attach; scrubbed parallax and heavy bridge timelines are simplified or skipped
- **Cursor tracking** — refs + GSAP `quickTo`, transform only; no React state per pointermove
- **Animation cleanup** — GSAP contexts and ScrollTriggers reverted on unmount
- **Images** — `next/image` with aspect-ratio containers and responsive `sizes` when assets are provided
- **Keyboard** — command palette (`⌘K` / `Ctrl+K`, Escape); focus-visible styles in global CSS
- **Session preloader** — does not replay on internal navigation or return visits within the same session

---

## Getting Started

### Prerequisites

- Node.js 20+ recommended
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
| Project ids, routes, media paths | `src/lib/projects.ts` |
| Site URL, email, socials, portrait flag | `src/lib/constants.ts` |
| Case study pages | `src/app/work/[slug]/page.tsx` + `CaseStudyView` |
| Work media | `PROJECTS[id].image` → typically under `public/images/work/` |
| Portrait | `PORTRAIT` in constants → `public/images/portrait.jpg` when enabled |

To add a screenshot: place the asset under `public/`, set `image` on the project in `src/lib/projects.ts`, and keep related copy in the message files.

---

## Status

**Product shell and narrative are implemented** — design system, i18n, motion systems, home story, case study routes, command palette, and performance-aware interaction layers.

**Content assets still pending:**

- Portrait (`PORTRAIT.hasPortrait` is currently `false`)
- Project product screenshots (`image: null` for all projects — placeholders render)
- Production contact details (email marked as placeholder in `src/lib/constants.ts`; GitHub / LinkedIn hrefs are stubs; Instagram is configured)
- Configured canonical URL in metadata: `https://usukhbayar.dev` (`SITE.url`) — replace or confirm before public launch if needed

No WebGL in this version by design.

---

## Author

**Usukhbayar**  
Product Engineer · Frontend & Mobile  
Ulaanbaatar, Mongolia

- Instagram: [instagram.com/usukh6ayar](https://instagram.com/usukh6ayar)
- Repository: [github.com/usukh6ayar/Portfolio](https://github.com/usukh6ayar/Portfolio)

---

## License

No open-source license file is included.

This is a personal portfolio. All rights reserved unless a separate license is added later. Do not reuse branding, copy, or project case content without permission.
