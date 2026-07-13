# Usukhbayar — Portfolio

Premium product-engineer portfolio. Dark, minimal, editorial.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · GSAP · Framer Motion · Lenis

## Design system (Acid Signal, refined)

| Token | Value |
|--------|--------|
| Background | `#0A0A0A` |
| Surface 1 | `#111111` |
| Surface 2 | `#181818` |
| Text | `#F5F5F0` |
| Muted | `#8A8A85` |
| Accent | `#B8F300` |
| Secondary | `#A78BFA` (sparingly) |

**Type:** Clash Display · Geist · JetBrains Mono

## i18n (next-intl)

English (default) + Mongolian. Client-side only — no `/en` or `/mn` routes.

```
messages/
  en.json
  mn.json
```

- Library: **next-intl** (SPA mode, no locale URL segments)
- Switcher in nav: **EN | МН**
- Preference in `localStorage` (`portfolio-locale`)
- First visit: browser language → English fallback
- Fonts: Clash Display + Manrope (Cyrillic display) · Inter (body, Cyrillic) · JetBrains Mono

## Phase 1 (current)

- Design tokens + global styles
- Typography setup
- Sticky navigation + scroll progress
- Preloader
- Lenis smooth scroll
- Hero + About sections
- EN / МН i18n
- Command palette (`⌘K`)
- Magnetic CTAs
- Reduced-motion support

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- Email / social URLs in `src/lib/constants.ts` are placeholders — replace before launch.
- Case study content waits on real screenshots and project details.
- No WebGL in v1 (performance + a11y first).
