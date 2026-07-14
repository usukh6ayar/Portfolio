# Portfolio website — full brief for UI/UX design audit

**Purpose of this document:** Give a designer or design AI everything needed to understand, critique, and improve this portfolio without reverse-engineering the codebase.

**How to use:** Paste this file into ChatGPT (or hand it to a UI/UX designer) and ask for a structured audit: hierarchy, storytelling, visual system, motion, accessibility, mobile, and prioritized recommendations.

---

## 1. Project identity

| Field | Value |
|--------|--------|
| **Site type** | Personal portfolio (product engineer) |
| **Owner** | Usukhbayar (display name also in Mongolian: Өсөхбаяр) |
| **Age / base** | 22 · Ulaanbaatar, Mongolia |
| **Education** | Computer Science, National University of Mongolia · graduating 2027 |
| **Company** | Founder, Hustle Hive LLC |
| **Positioning** | Full-stack developer who designs thoughtfully and ships real products — not a pure designer portfolio, not a résumé template |
| **Primary audiences** | (1) Engineering managers / internship recruiters · (2) Design-conscious founders / freelance clients |
| **Primary languages** | English (default) · Mongolian (МН) — client-side switch, no `/en` `/mn` URLs |
| **Repo** | GitHub: `usukh6ayar/Portfolio` (or local `Portfolio`) |
| **Theme** | Dark mode only |

### Positioning statement (product intent)

> “I design thoughtfully, but I build and ship real products.”

The site should communicate craftsmanship and product thinking — closer to **Apple / Linear / Stripe / Vercel product pages** than to Awwwards experimental art sites, Dribbble galleries, or agency marketing sites.

---

## 2. Tech stack (for context only)

Not a design deliverable, but affects motion, performance, and feasibility.

| Layer | Choice |
|--------|--------|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + CSS design tokens |
| Motion | GSAP + ScrollTrigger · Framer Motion (UI / page / layout) |
| Smooth scroll | Lenis |
| i18n | next-intl (client locale, localStorage, browser detect) |
| Deploy target | Vercel-ready |

**No WebGL** in v1 (performance / a11y first).

---

## 3. Information architecture

### 3.1 Hybrid structure

- **Single-page home** (`/`) with long scroll narrative  
- **Separate case study routes** (`/work/[slug]`) for projects  

### 3.2 Home page flow (top → bottom)

This order is intentional storytelling — **who → flagship → support work → tools → contact**.

```
[Preloader]
[Sticky Navigation + scroll progress bar]

1. Hero (#top)
   └─ SectionBridge → About

2. About (#about)
   └─ SectionBridge → Featured

3. Featured Project (#featured)  ← SparkXP (flagship only)
   └─ SectionBridge → Selected Works

4. Selected Works (#work)  ← secondary projects only
   └─ SectionBridge → Skills

5. Skills / Stack (#stack)
   └─ SectionBridge → Contact

6. Contact (#contact)  ← includes integrated footer
```

### 3.3 Case study routes

| Path | Project |
|------|---------|
| `/work/sparkxp` | SparkXP (flagship) |
| `/work/beauty-corner` | Beauty Corner |
| `/work/qr-menu` | QR Menu |
| `/work/ai-image-studio` | AI Image Studio |

Case studies use shared-element style transitions (Framer Motion `layoutId` on title/media where applicable). Content is structured; metrics/screenshots are placeholders until real assets land.

### 3.4 Navigation (global)

Sticky header:

- Logo / name (scroll to top)  
- Links: About · Work (jumps to **#featured**) · Stack · Contact  
- Status pill: “Available for Freelance”  
- Language: **EN | МН** (no flags)  
- Command palette: **⌘K** / Ctrl+K  

Mobile: hamburger + language + ⌘K.

---

## 4. Design system (“Acid Signal” — product-engineer refinement)

### 4.1 Color

| Token | Hex / value | Role |
|--------|-------------|------|
| Background | `#0A0A0A` | Page base |
| Surface 1 | `#111111` | Cards, elevated surfaces |
| Surface 2 | `#181818` | Nested surfaces, hover fills |
| Text | `#F5F5F0` | Primary text (warm off-white) |
| Muted | `#8A8A85` | Secondary text, captions |
| **Primary accent** | **`#B8F300`** | Soft acid lime — emphasis, CTAs, active states |
| Secondary accent | `#A78BFA` | Violet — **sparse only** (links/hints, never competes with lime) |
| Border | `rgba(245,245,240,0.08)` | Hairlines |
| Border strong | `rgba(245,245,240,0.14)` | Stronger dividers |
| Overlay | `rgba(10,10,10,0.72)` | Modals / command palette |

**Rules:**

- Dark only (no light theme).  
- Lime is the brand signal.  
- Violet must stay supporting.  
- Avoid neon glow, cyberpunk, gaming aesthetic, heavy glassmorphism.

### 4.2 Typography

| Role | Family | Notes |
|------|--------|--------|
| Display | Clash Display (+ Manrope fallback for Cyrillic) | Oversized headlines, tight tracking |
| Body / UI | Inter (Latin + Cyrillic) | Readable product UI |
| Mono | JetBrains Mono (Latin + Cyrillic) | Labels, kbd, stack tags, meta |

**Type philosophy:** Big type *is* the design. Hierarchy comes from scale/weight more than color count.

Approximate scale (CSS clamps):

- Display XL: ~`clamp(3rem, 11vw, 7.25rem)` (Hero name)  
- Display L / section: ~2–4.5rem  
- Body: ~1–1.0625rem  
- Caption / mono: ~0.625–0.75rem uppercase wide tracking  

### 4.3 Layout

| Token | Value |
|--------|--------|
| Content max width | ~1440px (`90rem`) |
| Page gutter | `clamp(1.25rem, 4vw, 2.5rem)` |
| Section vertical padding | `clamp(5rem, 12vh, 8rem)` |
| Nav height | `4.5rem` |
| Card / media radius | ~24px (`1.5rem`) |

Strong grid, lots of whitespace, sections that “breathe.”

### 4.4 Texture & atmosphere

- Very subtle full-page **grain** (~2.5% opacity)  
- Soft ambient radial wash (lime / faint violet) on Hero only  
- No WebGL particles or 3D hero in v1  

### 4.5 Motion principles

| Principle | Implementation intent |
|-----------|------------------------|
| Intentional | Motion explains hierarchy / handoff — not decoration |
| 60fps | Prefer transform + opacity |
| Reduced motion | `prefers-reduced-motion`: skip theatrical motion, instant states |
| Easing | Primary: `cubic-bezier(0.16, 1, 0.3, 1)` |
| Smooth scroll | Lenis (disabled when reduced motion) |
| Section handoff | `SectionBridge` previews next chapter (label + title + divider + soft glow) |

**Avoid:** image trails, custom cursor blobs, long delays, floating elements everywhere, dramatic wipes.

### 4.6 Cursor / micro-interactions (native cursor)

**OS cursor is kept** — no large custom circle cursor.

| Interaction | Behavior |
|-------------|----------|
| Magnetic buttons | Max ~4–6px spring pull; soft lime edge on primary |
| Project / media hover | Small lagging pill: e.g. “Case Study →”, “Preview”, “Say hello ↗” |
| Links | Underline expansion + slight arrow nudge |
| Primary Contact CTA | Full-width row: lime fill L→R, text → near-black, arrow diagonal |

Disabled under reduced motion / touch (coarse pointer).

---

## 5. Section-by-section specification

### 5.1 Preloader

- Full-screen dark  
- Mono name + counter `000–100` + thin lime progress bar  
- Short (~1.3–1.4s), product feel — not a spectacle  
- Unlocks main content + scroll  

### 5.2 Hero (`#top`)

**Job:** Introduce name, positioning, and primary next actions.

**Content (EN):**

- Status: Available for Freelance  
- Location · CS · NUM · 2027  
- Role: Full-stack Developer · Founder  
- Display name  
- Statement: “I design thoughtfully— / but I **build and ship** / real products.”  
- Subcopy: self-taught full-stack & mobile; Hustle Hive; education + consumer products from UB  
- CTAs: View selected work → `#featured` · Get in touch → `#contact`  
- Stack hint: React Native · Next.js · NestJS  
- Meta strip: Focus / Based / Company  

**Visual:** Typography-led, ambient glow, full viewport height, calm entrance timeline after preloader.

### 5.3 About (`#about`)

**Job:** Human story *before* projects — who he is and how he builds.

**Layout:** Asymmetric ~40/60 (portrait left sticky on desktop · editorial text right). Mobile: portrait first.

**Blocks:**

1. Editorial portrait (placeholder until real photo: abstract dark frame + “U”)  
2. Headline: “Thoughtful design. Practical engineering.”  
3. Intro + 3 short story paragraphs  
4. Quote: “Clear to use. Solid underneath. Built for real people.”  
5. Path timeline (2023 → Today)  
6. Principles (3): Ship real software · Clarity over cleverness · Own the full path  
7. Current focus chips (React, Next.js, RN, TS, Product Design, UI Engineering)  
8. **Now** card: what he’s building toward + freelance openness  

**Tone:** Confident but humble; no buzzwords (“passionate”, “world-class”, etc.).

### 5.4 Featured Project — SparkXP (`#featured`)

**Job:** Flagship product — largest visual weight of all work.

**Not** part of the secondary works list.

**Includes:**

- Label / category / year  
- Large display title  
- Short summary  
- Dominant hero screenshot (or editorial placeholder UI)  
- Problem · Solution · Outcome · Tech stack  
- Large primary CTA → case study `/work/sparkxp`  

**Feel:** Apple keynote / product launch slide — whitespace, hierarchy, screenshot as hero.

### 5.5 Selected Works (`#work`)

**Job:** Supporting products after the flagship.

**Projects (order):**

1. Beauty Corner — Mobile · Booking · RN / Node / PostgreSQL  
2. QR Menu — Web · Hospitality · Next / TS / Node  
3. AI Image Studio — AI · Creative tools · Next / TS / AI  

**Layout (current):** Premium **editorial alternating** layout (no sticky stack):

| Project | Desktop composition |
|---------|---------------------|
| 1 | Text ~35% · Image ~65% |
| 2 | Image ~65% · Text ~35% |
| 3 | Text ~35% · Image ~65% |

- Each row ~70–80vh  
- Generous vertical gap between projects  
- Screenshot is never a small thumbnail  
- Per project: index, category, year, title, summary, mono stack tags, “View Case Study”  
- Scroll: mask reveal on image, text stagger, fade, slight translateY, tiny scale  
- Mobile: image first, text below  

**Important for auditors:** Screenshots/years/outcomes are often placeholders (`—`, abstract UI shells). Do not treat placeholder media as final brand photography.

### 5.6 Skills / Stack (`#stack`)

**Job:** Show tools as product language, not a résumé bullet dump.

**Groups (EN):**

- Product UI — React, Next.js, TypeScript, Tailwind  
- Mobile — React Native, Expo  
- Backend — Node.js, NestJS, Express, PostgreSQL  
- State & craft — Zustand, GSAP, Framer Motion  

Layout: 4-column card grid on large screens; intro line above.

### 5.7 Contact (`#contact`) + integrated footer

**Job:** Final chapter — one obvious action: contact me.

**Not:** Generic form · SaaS inquiry card · agency contact block.

**Structure:**

1. Near full-viewport closing scene  
2. Large headline (EN):  
   - Line 1: “Let's build”  
   - Line 2: “something **useful**.” (accent on **useful**)  
3. Short body: open to product work, frontend/mobile roles, selected freelance  
4. **Full-width editorial CTA row** (not a pill button):  
   - “Start a project” …………… ↗  
   - Hairline top/bottom borders  
   - Hover: acid lime fill L→R, text near-black, arrow diagonal  
   - Cursor label: “Say hello ↗”  
   - Action: `mailto:usukhbayrgan@gmail.com`  
5. Typographic links: Email · GitHub · LinkedIn · **Instagram** (`instagram.com/usukh6ayar`)  
6. **Footer integrated in Contact** (not a separate visual orphan):  
   - Name + “Frontend & Mobile Developer”  
   - Connect links  
   - Ulaanbaatar + local clock (Asia/Ulaanbaatar)  
   - EN \| МН switcher  
   - © current year  

**Mongolian headline (adapted, not literal):** “Хэрэгтэй зүйл / хамт **бүтээе**.”

### 5.8 Section bridges

Between major sections, a **SectionBridge** softens cuts:

- Soft accent glow  
- Thin divider draw  
- “Next · {section}” mono label  
- Preview title of next chapter  

Intent: one continuous editorial magazine story, not stacked independent pages.

---

## 6. Content & assets status

| Item | Status |
|------|--------|
| English / Mongolian UI copy | In `messages/en.json` · `messages/mn.json` |
| Real portrait | Placeholder (set `PORTRAIT.hasPortrait` + image path when ready) |
| Project screenshots | Mostly abstract UI placeholders |
| Project years / outcomes / metrics | Often “—” or honest “will list when measured” — **do not invent KPIs** |
| Email | `usukhbayrgan@gmail.com` |
| GitHub / LinkedIn URLs | Placeholders in config (Instagram is set) |
| Case study deep copy | Scaffolded; real research/results still needed |

---

## 7. Accessibility & quality bar (stated goals)

- Fully responsive (mobile considered, not stripped-down)  
- Keyboard focus visible (lime outline)  
- `prefers-reduced-motion` respected  
- Command palette keyboard nav  
- Contrast: warm off-white on near-black + lime accent  
- Target: Lighthouse 90+ performance (ongoing)  
- Dark-only  

---

## 8. What “good” looks like for this brand

**Do reinforce:**

- Shipper / product engineer identity  
- Calm confidence  
- Editorial typography  
- Hierarchy: SparkXP >> secondary works  
- Human story before projects  
- Single clear contact action  

**Do not push toward:**

- Design-agency experimental portfolio  
- Template SaaS marketing site  
- Dribbble card gallery  
- Cyberpunk / neon club aesthetic  
- Over-motion, custom cursor blobs, particle systems  

---

## 9. Suggested audit checklist for UI/UX designer

Please evaluate and report with **severityitized findings** (P0 / P1 / P2):

### Storytelling & IA
- [ ] Does the section order tell a clear story?  
- [ ] Is SparkXP unmistakably the flagship?  
- [ ] Is Contact a satisfying closing chapter?  
- [ ] Are SectionBridges helpful or noisy?  

### Visual system
- [ ] Color balance (lime vs violet vs neutrals)  
- [ ] Type scale consistency across sections  
- [ ] Spacing rhythm / whitespace quality  
- [ ] Border / radius / surface consistency  
- [ ] Grain and ambient effects: too much / too little?  

### Component UI
- [ ] Nav clarity and sticky behavior  
- [ ] Hero hierarchy and CTA priority  
- [ ] About portrait + editorial density  
- [ ] Featured vs Selected Works visual hierarchy  
- [ ] Skills cards vs “badge spam” risk  
- [ ] Contact CTA row usability and desirability  

### Interaction & motion
- [ ] Motion purposeful vs decorative  
- [ ] Hover system (magnetic, follow labels) — subtle enough?  
- [ ] Scroll feel with Lenis  
- [ ] Reduced-motion experience  

### Responsive
- [ ] Mobile Hero / About / projects / Contact  
- [ ] Touch targets and nav drawer  
- [ ] No “desktop-only” prestige lost on mobile  

### Accessibility
- [ ] Contrast  
- [ ] Focus states  
- [ ] Screen-reader landmarks / heading order  
- [ ] Language switch and document language  

### Content readiness
- [ ] Where placeholders hurt credibility most  
- [ ] What must be real before public launch  

### Deliverable format requested from auditor

1. **Executive summary** (5–8 bullets)  
2. **What’s working**  
3. **Critical issues** (block launch)  
4. **Improvements** (high impact / medium effort)  
5. **Polish ideas** (nice-to-have)  
6. **Recommended next 3 design actions**  

---

## 10. File map (for technical collaborators)

```
messages/
  en.json · mn.json          ← all user-facing copy
src/app/
  page.tsx                   ← home composition
  layout.tsx                 ← fonts, providers, nav shell
  work/[slug]/page.tsx       ← case studies
src/components/
  sections/                  ← Hero, About, Featured, Works, Skills, Contact
  layout/                    ← Nav, Preloader, SectionBridge, ScrollProgress
  ui/                        ← buttons, links, language, command palette
  work/                      ← ProjectMedia, CaseStudy*
src/lib/
  constants.ts · projects.ts · fonts · i18n · tokens in globals.css
```

---

## 11. One-paragraph summary (for cold intros)

Usukhbayar’s portfolio is a **dark, typography-led product-engineer site** with EN/MN support. It tells a continuous story: who he is (About), his flagship product (SparkXP), supporting products (editorial alternating works), tools (Skills), and a strong closing Contact chapter with a full-width “Start a project” CTA and integrated footer. Visual language is near-black + soft acid lime, Clash Display + Inter, restrained motion (Lenis/GSAP/Framer), native cursor with subtle magnetic and follow-label interactions. Real portrait, screenshots, metrics, and some social URLs are still placeholders.

---

*Document generated for UI/UX audit · Portfolio of Usukhbayar · Structure reflects the codebase as of the Contact / Instagram update.*
