# Portfolio audit — usukhbayar.dev

Inspected 2026-09-13: the live site, this codebase, and all nine repositories
under `github.com/usukh6ayar`. Every claim below is traced to something
checkable; where evidence is missing it says so rather than guessing.

---

## Evidence gathered

| Repo | Visibility | Your commits | Contributors | Stack | Live |
| --- | --- | --- | --- | --- | --- |
| **NomadKids** | public | 298 (≈79%) | 4 | TS monorepo · Next + NestJS + Prisma + Postgres + R2 · Docker · Caddy · Railway · CI | `nomadkids.mn` **200** |
| **SparkXP** | public | 474 (≈72%) | 6 | React Native/Expo + NestJS + Postgres + Redis + Vite admin | `spark-xp.vercel.app` **200** |
| SparkXP_web | **private** | 5 | 1 | Next.js | `spark-xp-web.vercel.app` **200** |
| ByatshanNuudelchid | public | 75 (75%) | 2 | Django · Docker · Caddy | not deployed |
| **NomadThreads** | public | 26 (≈79%) | 2 | React Native/Expo | not deployed |
| Blur-Lake-Resort | **private** | 25 | 1 | Next.js + PRD | not deployed |
| NailBliss | public | 15 human + **13 bot** | 3 | Vite + Supabase | **404 — dead** |
| Photo-App | public | 2 | 1 | JS, `cs142password.js`, `node_modules` committed | none |

Verifiable leadership evidence:

- **SparkXP `ROADMAP.md`** names owners outright: *"**Өсөхбаяр** (lead) — `/backend` + `/admin` — endpoints, DB, migration, admin panel, prod deploy (Railway), `API.md`"*. That is a written division of labour with you as lead, not a claim.
- **NomadKids** ships `docs/ARCHITECTURE.md`, `DATABASE.md` (28 tables), `API.md`, `SECURITY.md` (108-case acceptance matrix), `MIGRATION_PLAN.md`, `DEPLOYMENT.md`. Producing that set *is* technical direction.
- Commit share on both (79% / 72%) is consistent with leading a small team, not with being one contributor among equals.

---

## A. Overall score — 6.5 / 10

A genuinely well-built site (7.5 as craft) carrying positioning that costs it
roughly a point and a half. The engineering is ahead of the message.

| Dimension | Score | Note |
| --- | --- | --- |
| Visual design | 8 | Distinctive, restrained, not a template |
| Engineering quality | 8 | Next 16, strict TS, real a11y, lazy 3D |
| Positioning | 4 | Frontend-first, leadership invisible |
| Proof of work | 6 | Two real case studies, but ranked wrong |
| Client conversion | 3 | No services, no inquiry form, no budget |
| SEO | 4 | No og:image, no sitemap, no robots, weak h1 |
| Mobile | 7 | Responsive and clean; not *designed* for mobile |

---

## B. Current positioning analysis

The site says, in its own words:

- `h1` — **"Usukhbayar"**. A name. It answers *who*, never *what*.
- Role label — **"Full-Stack Developer"** ✓
- Statement — *"I design, build, and ship products people actually use."* — good line, and true.
- Subcopy — *"**Frontend and mobile** products with a product mindset…"* — this is the core problem.
- Capabilities — *"What I can take from problem to a shipped **product interface**."*
- Contact — *"Open to **full-stack roles** and selected freelance work."*
- Meta description — *"…building **frontend and mobile** products."*

Read together, a visitor concludes: **a frontend/mobile developer with good
taste, looking for a job.** Your actual work is a 28-table Postgres schema, a
national-system integration, a NestJS API on Railway, and two teams you led.

Three specific mismatches:

1. **"Frontend and mobile" is stated three times** — hero subcopy, capabilities intro, meta description. The backend is the deepest part of your work and it is the part the copy keeps qualifying away.
2. **Leadership appears exactly once**, buried in a NomadKids highlight bullet: *"Built by a team of two that I led."* It is never in the hero, the about, or any role label. It is your single strongest differentiator against every other full-stack developer in Ulaanbaatar.
3. **"Open to full-stack roles"** tells a client you would rather be employed. Anyone weighing a project budget reads that as *this person is not really available*.

---

## C. Top 10 strengths

1. **Real production deployments, verified.** `nomadkids.mn`, `spark-xp.vercel.app` and the landing page all return 200 right now. Most portfolios at this level link to dead Vercel URLs — yours are alive.
2. **A national-system integration.** ESIS, 39 services wired against the ministry's v2 catalogue of 198, matched service-for-service. Almost nobody at any level has this on a portfolio. It is your single most differentiating fact.
3. **Security treated as an artefact, not a vibe.** Same-site HttpOnly cookies, rotating refresh, no token in `localStorage`, presigned R2 media, a 108-case acceptance matrix, self-assessment against ministerial order A/261 — and you label it *self-assessed, not certified*. That restraint reads as senior.
4. **Written technical direction.** `ARCHITECTURE.md`, `DATABASE.md`, `SECURITY.md`, `MIGRATION_PLAN.md`, `CODING_RULES.md`, `ROADMAP.md` with named owners. This is the evidence of leadership, and it is all public.
5. **A documented rewrite.** Django v1 (25,601 lines, 751 tests) kept deliberately as a behavioural specification for the TypeScript v2, with a migration plan recording what was kept, transformed and dropped. That is architectural judgement.
6. **Three surfaces on one product.** SparkXP is a mobile app, a landing page and an admin dashboard on one NestJS API — it proves you can hold a whole product, not a layer.
7. **Role-based workflows in the real world.** Director, teacher, cook, parent — four roles with server-side authorization per role *and per child*, plus membership-based roles so one person can be both teacher and parent. That is a genuinely hard modelling problem, solved.
8. **The site itself is a work sample.** Next 16, strict TypeScript, zero console errors across every route, lazy-loaded 3D, reduced-motion honoured throughout, real focus management in the lightbox.
9. **Bilingual EN/MN**, switched client-side with no route duplication. Locally relevant and technically tidy.
10. **Craft that is actually distinctive.** The acid-on-near-black system, the mono captions, the cut-out device shots. It does not look like a template, which is rarer than it sounds.

---

## D. Top 10 weaknesses

1. **`h1` is "Usukhbayar".** It is the most valuable string on the site, for both humans and search, and it carries no information. Nobody searches your name; they search what you do.
2. **Leadership is invisible above the fold.** Two led teams, documented in public repos, and the hero does not mention it.
3. **"Frontend and mobile" undersells you three separate times.** Fix the phrase everywhere, not just in the hero.
4. **No services section.** A client cannot find out what you would build for them or how to start. The site is organised around *your work*, not *their problem*.
5. **No inquiry form.** `mailto:` is the highest-friction contact channel there is. There is no project type, no budget band, no timeline — so the leads you do get arrive unqualified.
6. **"Open to full-stack roles"** actively repels the freelance client you say you want.
7. **NomadKids is ranked below SparkXP** and sits under a heading called *"More products"* as an `h3`. NomadKids is the stronger commercial proof — it is deployed on its own domain for a paying client with a national-system integration.
8. **No `og:image`.** Every link you paste into a DM, Slack, or LinkedIn renders as a bare grey card. This is the cheapest fix on the list with the widest reach.
9. **No `robots.txt`, no `sitemap.xml`, no structured data.** For a single-page site those matter more, not less.
10. **Commit attribution is broken on three repos.** NomadThreads, Blur Lake Resort and NailBliss were committed as `usukhbayar.gant@nomin.net`, an address not attached to your GitHub account. GitHub therefore credits **`anuurrk`** as NomadThreads' only contributor and shows you with none. Anyone who checks — and a technical hiring manager will — sees a repo on your profile that you apparently did not write.

---

## E. Top 10 highest-impact improvements

| # | Change | Effort | Why it pays |
| --- | --- | --- | --- |
| 1 | Rewrite the hero: positioning `h1`, leadership in the first sentence, two CTAs | S | Fixes the five-second test and the single most important heading |
| 2 | Add `og:image` | S | Every shared link stops looking broken |
| 3 | Promote NomadKids to `01` | S | Leads with the strongest commercial proof |
| 4 | Add a Services section (4 offers, outcome-led) | M | Gives a client something to buy |
| 5 | Add an inquiry form with project type, budget band, timeline | M | Converts and qualifies in one step |
| 6 | Replace "frontend and mobile" everywhere with full-stack + lead | S | Removes the self-limiting frame |
| 7 | Fix git attribution on the three repos | S | Removes a credibility landmine |
| 8 | Add `robots.txt`, `sitemap.xml`, `Person` + `ProfessionalService` JSON-LD | S | Basic discoverability you currently lack |
| 9 | Add Role / Team / Ownership blocks to both case studies | M | Makes leadership legible where the proof already is |
| 10 | Add a four-step process section | S | Signals a professional engagement, not a favour |

P0 is items 1, 2, 3, 6, 7 — roughly a day, and most of the gain.

---

## F. What should NOT be changed

- **The visual identity.** Acid-on-near-black, the display/mono pairing, the grain. It is distinctive and it works. Do not modernise it.
- **The statement line.** *"I design, build, and ship products people actually use."* Keep it verbatim. It is the best sentence on the site.
- **Honesty about status.** *"self-assessed, not certified"*, *"in development"*, *"measured results go here once the app is in users' hands — not before"*. This restraint is worth more than any invented metric. Never soften it.
- **The engineering.** Strict TS, lazy 3D, reduced-motion handling, focus management. Do not rewrite working code for its own sake.
- **The bilingual switch.** Client-side, no route duplication. Correct call.
- **The case-study depth.** The ESIS numbers, the 28-table schema, the security matrix. Reorganise the presentation; keep every fact.

---

## G. Recommended structure

```
Hero                  positioning · leadership · availability · 2 CTAs
Selected work         01 NomadKids · 02 SparkXP
Services              4 outcome-led offers
How I work            Discover → Plan → Build → Ship
About                 full-stack · ownership · leadership · education last
Capabilities          grouped by what it does, tools secondary
Contact               inquiry form + direct email
```

Two changes from what you have: **Services** and **How I work** are new, and
**About** moves below the work. Proof first, then what you sell, then who you
are. The current order asks a stranger to care about you before you have shown
them anything.

---

## H. Hero — exact copy

**Eyebrow**
> `● OPEN FOR PROJECTS` · Full-Stack Developer & Technical Lead

**h1**
> Usukhbayar Gantulga

**Statement** (keep, it already works)
> I design, **build, and ship** products people actually use.

**Subcopy** — replaces the frontend/mobile framing
> Full-stack engineer in Ulaanbaatar. I've led the development of two
> production products end to end — web, mobile and the backend behind
> them — from architecture through deployment.

**CTAs**
- Primary: **See what I've shipped**
- Secondary: **Start a project**

**Footer strip**
> Ulaanbaatar, Mongolia · Available for new projects

Why this: the eyebrow carries the role *and* the leadership; the subcopy states
two production products and the full stack without adjectives; "shipped" is a
claim you can back with two live URLs.

Mongolian:

> **Бүрэн стекийн хөгжүүлэгч · Техникийн ахлагч**
>
> Улаанбаатарт ажилладаг full-stack инженер. Хоёр бүтээгдэхүүнийг архитектураас
> эхлээд production хүртэл — веб, мобайл, ард нь байгаа backend — багийг ахлан
> хөгжүүлсэн.
>
> **Хийсэн бүтээлүүд** · **Төсөл эхлүүлэх**

---

## I. Services — exact copy

> ### What I build
> Four things I've taken all the way to production. If your problem looks like
> one of these, I can tell you what it takes in a first call.

**01 — Business web applications**
> Admin dashboards, management systems and internal tools: role-based access,
> real workflows, reporting. NomadKids runs four separate roles against one
> API with authorization enforced server-side, per role and per record.

**02 — Mobile products**
> Cross-platform iOS and Android with React Native and Expo, built against a
> backend I design at the same time — so the app and the API fit each other
> instead of being negotiated later.

**03 — Backend & API systems**
> NestJS and PostgreSQL: schema design, authentication and authorization,
> background jobs, file storage, third-party integrations. Including
> integration with Mongolia's national education system.

**04 — From idea to production**
> Discovery, architecture, build and deployment as one engagement. Domains,
> TLS, CI, backups and monitoring included — a product that is live, not a
> repository you have to find someone else to ship.

No technology lists. Every claim is traceable to a repo.

---

## J. About — exact copy

> ### Thoughtful design. Practical engineering.
>
> I'm Usukhbayar — a full-stack developer in Ulaanbaatar. I build web and
> mobile products, and I take technical ownership of them: architecture,
> database, API, interface and deployment.
>
> On my last two products I led the development team. At **Retro Mind LLC**
> I work full-stack across the whole product. On **NomadKids** I set the
> architecture and wrote the specifications the team built against; on
> **SparkXP** I owned the backend, the admin dashboard and production
> deployment while two developers built the mobile app.
>
> That means I can be handed a problem rather than a ticket. I decide how a
> system is put together, which trade-offs are worth making, and what has to
> be true before it goes live.
>
> CS at the National University of Mongolia, 2027. Most of what I know came
> from shipping.

Education is one sentence, last. Leadership is specific about *what you owned*,
which is what makes it credible rather than boastful.

---

## K. Contact — exact copy

> ### Let's build something useful.
>
> Tell me what you're building and I'll tell you what it takes — honestly,
> including when it's more than you need.
>
> Usually replies within a day.

Form:

| Field | Type |
| --- | --- |
| Name | text |
| Email | email |
| What are you building? | web app · mobile app · e-commerce · booking / internal system · not sure yet |
| Tell me about it | textarea |
| Budget | under ₮2M · ₮2–5M · ₮5–15M · ₮15M+ · not sure yet |
| Timeline | ASAP · 1–3 months · 3+ months · exploring |

Submit: **Send project details**

Notes: budget in ₮ for local clients, with a USD equivalent shown on the
English site. Keep *"not sure yet"* on both — removing it costs you the early
conversations, which are the ones worth having. Keep the email visible under
the form for people who will not fill in a form.

---

## L. Project order

**01 — NomadKids** · **02 — SparkXP**

Two projects, and that is the right number — not a gap to apologise for.

NomadKids first because it is the strongest *commercial* proof: a paying
client, its own domain, a national-system integration, four user roles, a
28-table schema, and documented architecture. SparkXP second because it proves
range — mobile, gamification, AI, three surfaces, the biggest team.

Two deployed products you led beat five repositories every time. A visitor who
sees two case studies this deep does not count them; they conclude you finish
things. Padding with a 2025 undeployed app would *lower* the average, which is
the only number a portfolio really has.

The third slot stays empty until something earns it — most likely Blur Lake
Resort once it is deployed, since it adds a category (marketing/booking) that
neither current project covers.

---

## M. Project copy

### NomadKids

**One line** — A digital child-development portfolio for Mongolian
kindergartens, integrated with the national education system.

**Category** Web platform · Education · B2B
**Role** Full-Stack Developer & Technical Lead
**Team** 4 developers, including me
**Status** Deployed — `nomadkids.mn`

> Kindergartens tracked child development on paper, and the records scattered
> whenever a child changed group, year or kindergarten. NomadKids gives
> teachers a place to record observations and assessments, parents a view of
> their own child, and administrators the kindergarten itself — with reports
> that export as Mongolian-Cyrillic A4 PDFs.
>
> I set the architecture, designed the database and the authorization model,
> and wrote the specifications the team built against. I also owned the ESIS
> integration and the production deployment.

**Key capabilities** — four roles with separate workflows · per-child access
control · ESIS sync with a read-only dry run and an audit log · PDF reports in
Mongolian · private media behind presigned URLs

**Technical highlights**
- 28-table schema with the authorization boundary designed into it, not bolted on
- Roles on membership rather than the account — one person can be both teacher and parent
- Same-site HttpOnly cookies, short access token with rotating refresh, no token in `localStorage`
- 39 ESIS services wired against the ministry's v2 catalogue of 198, chosen on least privilege
- Multi-tenant by construction: one provider token, per-kindergarten institution mapping, so tenant data cannot cross the integration
- Puppeteer PDF worker on a BullMQ queue, benchmarked before it was committed to

**Why it matters** — A real client, a real deployment, and an integration with
a government system that most developers never get near. It is the clearest
evidence that you can own a product rather than implement a piece of one.

**Screenshots** 1. Director dashboard 2. Teacher board 3. ESIS console
4. Parent view 5. A generated PDF report

**Case-study sections** Overview → Problem → Solution → My role & the team →
Roles → Architecture → Security → Gallery → Engineering highlights

---

### SparkXP

**One line** — A gamified English-learning product for Mongolian students:
mobile app, landing page and admin dashboard on one API.

**Category** Mobile · Education · Consumer
**Role** Full-Stack Developer & Technical Lead
**Team** 6 contributors, including me
**Status** Admin and API deployed; the app is in development ahead of store release

> SparkXP teaches English in short daily sessions — structured lessons,
> spaced-repetition vocabulary, XP and streaks, and an AI buddy for text and
> voice practice.
>
> I led the project and owned the backend, the admin dashboard and production
> deployment — endpoints, database, migrations, the AI content pipeline and
> the Railway deploy — while two developers built the mobile app against the
> API and its documentation.

**Key capabilities** — structured lessons · SRS vocabulary · XP, streaks,
leaderboards · AI buddy (text and voice) · teacher classes with join codes and
assignments · admin content and plan-limit management

**Technical highlights**
- Three clients on one NestJS API, kept honest by a written `API.md`
- PostgreSQL for the domain, Redis for sessions, limits and leaderboards
- AI generation pipelines with per-plan limits enforced server-side
- A written `CODING_RULES.md` and a `ROADMAP.md` with named owners per area — how six people shipped without stepping on each other

**Why it matters** — Proves range: mobile, backend and admin, across the
largest team. The ownership split is documented in the repository, so the
leadership claim is checkable.

**Screenshots** 1. App home 2. Lesson 3. AI buddy 4. Admin buddy config
5. Landing page

---

### Not featured, and why

| Project | Call | Why |
| --- | --- | --- |
| **NomadThreads** | Do not feature | Not deployed, last touched May 2025, and the commits are attributed to an email not linked to your GitHub account — the repo currently credits someone else for your work. Two strong case studies say more than two strong ones plus a weak third. Fix the attribution anyway (§S) so the repo is at least honest |
| **ByatshanNuudelchid** | GitHub only — but *referenced* | Same product as NomadKids, older Django stack. Featuring both dilutes. Instead, mention it *inside* the NomadKids case study: a 25,601-line, 751-test system you kept as the behavioural specification for the rewrite. That reframes it from an old project into evidence of architectural judgement. |
| **SparkXP_web** | Part of SparkXP | It is the landing surface, not a project |
| **Blur Lake Resort** | Hold | Private and undeployed. If you deploy it, it becomes a fourth featured project — it is the only pure marketing/booking site you have |
| **NailBliss** | Do not feature | Deployment is 404, and 13 of 29 commits are `gpt-engineer-app[bot]`. Anyone who looks will see it |
| **Photo-App** | **Archive it** | `cs142password.js` is Stanford coursework, `node_modules` is committed. It actively contradicts the positioning |

---

## N. Communicating leadership without exaggeration

The rule: **name what you owned, not what you are.** Titles are claims; scope
is evidence.

| Avoid | Use |
| --- | --- |
| "Senior engineer" | "Full-Stack Developer & Technical Lead" |
| "Managed a team" | "Led a team of four; I owned architecture, the database and deployment" |
| "Architected enterprise systems" | "Designed a 28-table schema with the authorization boundary in it" |
| "Expert in…" | "Integrated 39 ESIS services against the ministry's v2 catalogue" |

Three places it belongs, and nowhere else:

1. The hero eyebrow — `Full-Stack Developer & Technical Lead`
2. Each case study's **Role** and **Team** block
3. One About paragraph, specific about scope on each project

Keep the site's existing honesty markers. *"Self-assessed, not certified"* does
more for your credibility than any title, because it proves you distinguish
between the two.

---

## O. SEO

Present: title, description, canonical (`usukhbayar.dev`), `summary_large_image`
card type, semantic HTML, sensible heading order, alt text on every image.

Missing, in order of value:

1. **`og:image`** — a 1200×630 card. Declared `summary_large_image` with no image, so every shared link renders bare. Generate it with Next's `opengraph-image` route from data you already have.
2. **`h1`** — "Usukhbayar" → "Usukhbayar Gantulga — Full-Stack Developer & Technical Lead", or keep the name visually and carry the positioning in the `h1` with the name as a styled span.
3. **Meta description** — replace *"frontend and mobile products"*:
   > Full-stack developer and technical lead in Ulaanbaatar. I build web and mobile products end to end — architecture, backend, interface and deployment. Two production products shipped.
4. **`robots.txt`** and **`sitemap.xml`** — three routes; use Next's `sitemap.ts` and `robots.ts`.
5. **JSON-LD** — `Person` with `jobTitle`, `knowsAbout`, `sameAs` (GitHub, Instagram); `ProfessionalService` once Services exists.
6. **Case-study metadata** — per-route `title`/`description`/`og:image`. They are your deepest pages and they share the homepage card.

Keywords to place naturally in real sentences, not a list: *full-stack
developer Mongolia*, *web application development Ulaanbaatar*, *React Native
developer*, *Next.js NestJS developer*, *custom software Mongolia*.

---

## P. Mobile

Audited at 390 / 768 / 1440 in both locales across all three routes: **no
horizontal scroll anywhere**, no console errors, and the only clipped text was
one gallery caption (now wrapping). The foundation is genuinely fine.

What would make it *designed* rather than merely responsive:

1. **A sticky CTA bar** below the fold on mobile — "Start a project", always reachable. This is the single biggest mobile conversion lever and you have none.
2. **Hero height** — the portrait plus the type nearly fills 844px. Cap the portrait around 46vh so the first work card peeks above the fold and invites a scroll.
3. **Gallery** — four phones across becomes two on mobile; consider a swipeable rail instead, which is the native gesture for a row of screens.
4. **The 3D object** — the About canvas runs `frameloop="always"` on a phone. Drop to `demand` under 640px, or swap in a still. It is battery you are spending on decoration.
5. **Touch targets** — the gallery dot indicators are 6px tall. The 44px minimum is met by the buttons around them but not by the dots.
6. **Image weight** — the role dashboards are 2400×1800. Next serves responsive variants, but add explicit `sizes` on the showcase images so a phone never fetches the 2400px source.

---

## Q. Visual design

Keep: the palette, the type pairing, the grain, the mono captions, the cut-out
device shots, the restraint in motion.

Fix:

1. **Hierarchy, not style.** NomadKids as an `h3` under "More products" while SparkXP gets an `h2` tells the visitor which you think is better. Both should be equal `h2`s under one "Selected work".
2. **"More products" is a weak heading.** Use "Selected work" once, with numbered entries.
3. **Section rhythm.** Hero and About both open full-height; adding Services and Process will make the page feel long. Vary the vertical rhythm so sections read as different kinds of thing.
4. **One accent, one job.** Acid currently marks CTAs, active states, section numbers, the 3D ring and the cursor. Reserve it for *actions* and let structure be carried by the greys.
5. **Case-study hero.** Title, role, stack and links in one dense block is good; give the role and team line its own weight so leadership registers before the screenshots.

---

## R. Freelance conversion

The path from *interested* to *in touch* currently ends at a `mailto:`.

1. **Services** — a client cannot buy "capabilities". Four named offers with outcomes.
2. **Inquiry form** — project type, budget band, timeline. Qualifies as it converts.
3. **A second CTA in the hero** — "Start a project" alongside the work link.
4. **Sticky mobile CTA.**
5. **Process** — four steps tells a nervous client what working with you looks like.
6. **Availability** — the `● OPEN` pill is good; make it say what it means: "Open for projects · starting December".
7. **Response expectation** — "Usually replies within a day" measurably lifts form completion.
8. **Remove "open to full-stack roles"** from the client-facing page. If you want both audiences, put employment on a separate `/hire` or in the résumé, not on the page a client lands on.

---

## S. GitHub profile

1. **Fix the attribution.** Three repos were committed as `usukhbayar.gant@nomin.net`, which is not on your GitHub account. Add it in *Settings → Emails* — GitHub re-attributes historical commits immediately, and NomadThreads stops crediting `anuurrk` for work you did. **Do this first; it takes two minutes.**
2. **Add descriptions and homepage URLs** to NomadKids, SparkXP and Portfolio. Right now they have none, so your profile reads as a list of bare names.
3. **Add topics** — `nextjs`, `nestjs`, `react-native`, `postgresql`, `typescript`. This is how people find repos.
4. **Create a profile README** (`usukh6ayar/usukh6ayar`) with the same positioning as the site and links to the two live products.
5. **Archive Photo-App.** Coursework with `node_modules` committed.
6. **Pin three**: NomadKids, SparkXP, Portfolio. Pinning weaker repos alongside them averages your profile down.
7. **Add screenshots to the NomadKids and SparkXP READMEs.** Both are excellent documents that open with text; a technical reader decides in seconds.

---

## T. Roadmap

### P0 — this week (≈1 day, most of the gain)

1. Fix git email attribution on GitHub *(2 minutes, highest ratio on the list)*
2. Rewrite the hero — positioning, leadership, two CTAs
3. Add `og:image`
4. Promote NomadKids to `01`, one "Selected work" heading, both `h2`
5. Replace "frontend and mobile" everywhere
6. Rewrite the meta description
7. Remove "open to full-stack roles" from the contact section

### P1 — next two weeks

8. Services section (copy in §I)
9. Inquiry form with budget and timeline (§K)
10. Role / Team / Ownership blocks in both case studies
11. "How I work" — four steps
12. `robots.txt`, `sitemap.xml`, JSON-LD, per-case-study metadata
13. Sticky mobile CTA
14. GitHub descriptions, topics, profile README, archive Photo-App

### P2 — when there is time

15. Deploy Blur Lake Resort as a third project — the only category (marketing/booking) the current two do not cover
16. Architecture diagrams in both case studies
17. A written testimonial from the NomadKids client
18. Case-study metadata per route
19. Mobile: gallery rail, hero height, 3D on demand
20. Add the outcome numbers for SparkXP once it is in users' hands — and not before

---

## The one-sentence version

The engineering is already strong enough for the clients you want; the words
are not. Change what the site *says* about the same work — lead with
positioning instead of a name, put the two teams you led above the fold, rank
NomadKids first, and give a client something to buy and a form to fill in —
and it stops reading as a good developer's portfolio and starts reading as
someone who can be handed a product.
