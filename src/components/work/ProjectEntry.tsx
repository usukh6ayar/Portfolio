"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import type Lenis from "lenis";
import { useApp } from "@/components/providers/AppProviders";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { GalleryImage, ProjectId } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";
import { ProjectLinks } from "@/components/work/ProjectLinks";
import { PhoneScreen, isPhoneShot, shotKey } from "@/components/work/PhoneScreen";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/** Must match the pin-mode media query in globals.css (Work reel). */
const PIN_QUERY =
  "(min-width: 1024px) and (min-height: 700px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Scroll distance per surface, as a share of the viewport height. */
const STEP = 0.7;

type Role = { name: string; detail: string; surface?: string | null };

/**
 * A project told through the people who use it. Each surface is shown at a
 * size where its interface can actually be read, one at a time, with a line
 * saying what that person sees.
 *
 * On a desktop with a fine pointer the scene pins and scrolling lifts each
 * surface over the last; the names on the left are the index and jump to
 * their surface. Everywhere else it is a native swipe strip, and nothing moves
 * that the visitor did not move.
 */
export function ProjectEntry({
  id,
  featured = false,
}: {
  id: ProjectId;
  featured?: boolean;
}) {
  const t = useTranslations("work");
  const tc = useTranslations("work.caseStudy");
  const ts = useTranslations("work.surfaces");
  const tg = useTranslations("work.gallery.captions");
  const { isReady } = useApp();
  const { locale } = useLocaleSwitch();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  const project = PROJECTS[id];
  const copyRoot = featured ? "featured" : `projects.${id}`;
  const title = t(`${copyRoot}.title`);
  const stack = t.raw(`${copyRoot}.stack`) as string[];
  const headingId = `work-title-${id}`;

  const roles = tc.has(`${id}.roles`) ? (tc.raw(`${id}.roles`) as Role[]) : [];
  const stops = (project.reel ?? [])
    .map((src) => project.gallery?.find((shot) => shot.src === src))
    .filter((shot): shot is GalleryImage => Boolean(shot))
    .map((shot) => {
      // A project that documents its users names each surface by its person.
      const role = roles.find((r) => r.surface === shot.surface);
      return {
        shot,
        name: role?.name ?? (shot.surface ? ts(shot.surface) : title),
        caption: role?.detail ?? t(`reel.${id}.${shot.surface}`),
      };
    });
  const count = stops.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!isReady || !root || reduced || count < 2) return;

    const mq = window.matchMedia(PIN_QUERY);
    let ctx: gsap.Context | null = null;

    const build = () => {
      ctx?.revert();
      ctx = null;
      triggerRef.current = null;
      delete root.dataset.mode;
      setActive(0);

      if (mq.matches) {
        root.dataset.mode = "pin";
        ctx = gsap.context(() => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-reel-card]", root);
          gsap.set(cards.slice(1), { yPercent: 104 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${(cards.length - 1) * window.innerHeight * STEP}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              // Pins add scroll length; they measure before what sits below.
              refreshPriority: 1,
              onUpdate: (self) => {
                const next = Math.round(self.progress * (cards.length - 1));
                setActive((current) => (current === next ? current : next));
              },
            },
          });

          cards.slice(1).forEach((card, i) => {
            tl.to(card, { yPercent: 0, duration: 1 }, i)
              .to(cards[i], { scale: 0.94, duration: 1 }, i)
              .to(cards[i].querySelector("[data-reel-dim]"), { opacity: 0.65, duration: 1 }, i);
          });
          triggerRef.current = tl.scrollTrigger ?? null;
        }, root);
      }

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    build();
    mq.addEventListener("change", build);
    return () => {
      mq.removeEventListener("change", build);
      ctx?.revert();
      triggerRef.current = null;
      delete root.dataset.mode;
    };
    // Locale reflows the copy beside the pin, so the scene is measured again.
  }, [isReady, reduced, locale, count]);

  /** The swipe strip reports which surface is in front. */
  const onStripScroll = () => {
    const stage = stageRef.current;
    if (!stage || rootRef.current?.dataset.mode === "pin") return;
    const cards = stage.querySelectorAll<HTMLElement>("[data-reel-card]");
    let next = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft - stage.offsetLeft <= stage.scrollLeft + card.offsetWidth / 2) next = i;
    });
    setActive((current) => (current === next ? current : next));
  };

  const goTo = (index: number) => {
    const trigger = triggerRef.current;
    if (trigger) {
      const y = trigger.start + (trigger.end - trigger.start) * (index / (count - 1));
      const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y });
      return;
    }
    const card = stageRef.current?.querySelectorAll<HTMLElement>("[data-reel-card]")[index];
    const stage = stageRef.current;
    if (card && stage) {
      stage.scrollTo({
        left: card.offsetLeft - stage.offsetLeft - parseFloat(getComputedStyle(stage).paddingLeft),
        behavior: reduced ? "auto" : "smooth",
      });
    }
  };

  return (
    <article ref={rootRef} className="reel" aria-labelledby={headingId}>
      <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 xl:gap-20">
        <div className="flex flex-col">
          <p className="text-sm text-muted">
            {t(`${copyRoot}.category`)}, {t(`${copyRoot}.year`)}
          </p>
          <h2
            id={headingId}
            className="reel-display mt-3 font-display text-[clamp(2.5rem,4.6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
          >
            <Link href={project.href} className="transition-colors hover:text-accent">
              {title}
            </Link>
          </h2>
          <p className="mt-4 max-w-[34rem] text-[0.9375rem] leading-[1.7] text-muted">
            {t(`${copyRoot}.summary`)}
          </p>

          {/* The index: who this was built for. Not a sequence, so no numbers. */}
          <ul className="mt-8 hidden lg:block" aria-label={t("reelIndex")}>
            {stops.map((stop, i) => (
              <li key={stop.shot.src}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={active === i ? "true" : undefined}
                  className={cn(
                    "reel-display group/stop flex items-center gap-3 py-0.5 text-left font-display text-[clamp(1.375rem,2.1vw,2rem)] font-medium leading-[1.15] tracking-[-0.03em] transition-colors duration-300",
                    active === i ? "text-foreground" : "text-foreground/25 hover:text-foreground/60",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active === i ? "scale-100" : "scale-0",
                    )}
                  />
                  {stop.name}
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[34rem] text-sm text-muted">
            <span className="sr-only">{t("stackLabel")}: </span>
            {stack.join(", ")}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={project.href}
              className={cn(
                "inline-flex min-h-12 items-center gap-6 rounded-lg px-5 py-3 text-sm font-medium transition-colors",
                featured
                  ? "bg-accent text-on-accent hover:bg-foreground"
                  : "border border-border-strong hover:border-accent hover:text-accent",
              )}
            >
              {t("viewCaseStudy")}
              <span aria-hidden>↗</span>
            </Link>
            <ProjectLinks id={id} only={["live", "repo"]} />
          </div>
        </div>

        <div className="reel-media min-w-0">
          <div ref={stageRef} className="reel-stage" onScroll={onStripScroll}>
            {stops.map((stop) => {
              const phone = isPhoneShot(stop.shot.src);
              const alt = `${title}: ${tg(shotKey(stop.shot.src))}`;
              return (
                <figure key={stop.shot.src} data-reel-card className="reel-card">
                  <p className="reel-card-name mb-3 font-display text-lg font-medium tracking-[-0.02em]">
                    {stop.name}
                  </p>
                  <div className="reel-shot" data-kind={phone ? "phone" : "web"}>
                    {phone ? (
                      <PhoneScreen
                        src={stop.shot.src}
                        alt={alt}
                        quality={90}
                        sizes="(min-width: 1024px) 260px, 60vw"
                        className="h-full shadow-[0_30px_70px_-24px_rgba(0,0,0,0.95)]"
                      />
                    ) : (
                      <Image
                        src={stop.shot.src}
                        alt={alt}
                        width={3200}
                        height={2075}
                        quality={90}
                        loading="eager"
                        fetchPriority="low"
                        sizes="(min-width: 1440px) 820px, (min-width: 1024px) 56vw, 86vw"
                        className="reel-web"
                      />
                    )}
                  </div>
                  <figcaption className="mt-4 max-w-[60ch] text-sm leading-[1.7] text-muted">
                    {stop.caption}
                  </figcaption>
                  <span data-reel-dim aria-hidden className="reel-dim" />
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
