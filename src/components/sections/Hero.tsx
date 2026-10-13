"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { scrollToHash } from "@/components/providers/LenisProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PORTRAIT } from "@/lib/constants";
import { cn } from "@/lib/cn";

/**
 * The introduction runs against a portrait: name, statement and calls to
 * action on the left, a black-and-white photograph lit with a little acid on
 * the right. The name is sized in container units so it keeps filling its own
 * column whatever the portrait leaves it.
 */
export function Hero() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const tAbout = useTranslations("about");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isReady || !rootRef.current) return;

    const root = rootRef.current;
    const intro = root.querySelectorAll<HTMLElement>("[data-hero-intro]");
    const lines = root.querySelectorAll<HTMLElement>("[data-hero-line]");
    const body = root.querySelectorAll<HTMLElement>("[data-hero-body]");
    const ctas = root.querySelectorAll<HTMLElement>("[data-hero-cta]");
    const foot = root.querySelectorAll<HTMLElement>("[data-hero-foot]");
    const portrait = root.querySelectorAll<HTMLElement>("[data-hero-portrait]");

    if (reduced) {
      gsap.set([intro, lines, body, ctas, foot, portrait], {
        opacity: 1,
        y: 0,
        yPercent: 0,
        clearProps: "all",
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        portrait,
        { opacity: 0, scale: 1.03, clipPath: "inset(12% 0% 0% 0%)" },
        {
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.out",
        },
        0,
      )
        .fromTo(
          intro,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 },
          0.08,
        )
        .fromTo(
          lines,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.075 },
          // Absolute: the portrait's longer reveal runs alongside the type
          // rather than pushing it a second down the timeline.
          0.2,
        )
        .fromTo(
          body,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.4",
        )
        .fromTo(
          ctas,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
          "-=0.3",
        )
        .fromTo(
          foot,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.25",
        );
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced]);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative pb-8 pt-[calc(var(--nav-height)+1.5rem)] sm:pb-10 sm:pt-[calc(var(--nav-height)+2rem)] lg:pt-[calc(var(--nav-height)+2.5rem)]"
      aria-labelledby="hero-heading"
    >
      <div className="ambient-glow" aria-hidden />

      <div className="container-page relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-14 xl:gap-20">
          <div className="[container-type:inline-size]">
            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mb-7">
              <div data-hero-intro className={cn(!reduced && "opacity-0")}>
                <StatusPill />
              </div>
            </div>

            {/* The role sits inside the h1: the page's most valuable heading
                should say what this person does, not only who they are. It
                still reads as the eyebrow above the name. */}
            <h1 id="hero-heading">
              <span
                data-hero-intro
                className={cn(
                  "block font-mono text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-muted",
                  !reduced && "opacity-0",
                )}
              >
                {t("roleLabel")}
              </span>
              <span className="mt-4 block overflow-hidden pb-[0.08em] font-display text-[clamp(2.5rem,14.5cqw,9rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-foreground sm:mt-5">
                <span data-hero-line className={cn("block", !reduced && "opacity-0")}>
                  {tCommon("name")}
                </span>
              </span>
            </h1>

            <p className="mt-5 font-display text-[clamp(1.375rem,4.6cqw,2.5rem)] font-medium leading-[1.2] tracking-[-0.035em] text-foreground/90 sm:mt-6">
              <span className="block overflow-hidden">
                <span data-hero-line className={cn("block", !reduced && "opacity-0")}>
                  {t("statement.line1")}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className={cn("block", !reduced && "opacity-0")}>
                  {t("statement.line2Before")}
                  <span className="text-accent">{t("statement.line2Accent")}</span>
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className={cn("block", !reduced && "opacity-0")}>
                  {t("statement.line3")}
                </span>
              </span>
            </p>

            <p
              data-hero-body
              className={cn(
                "mt-6 max-w-[36rem] text-[0.9375rem] leading-[1.75] text-muted sm:text-base",
                !reduced && "opacity-0",
              )}
            >
              {t("subcopy")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <div data-hero-cta className={cn(!reduced && "opacity-0")}>
                <MagneticButton
                  href="#featured"
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash("#featured");
                  }}
                >
                  {t("ctaWork")}
                </MagneticButton>
              </div>
              <div data-hero-cta className={cn(!reduced && "opacity-0")}>
                <MagneticButton
                  href="#contact"
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash("#contact");
                  }}
                >
                  {t("ctaContact")}
                </MagneticButton>
              </div>
            </div>
          </div>

          <figure
            data-hero-portrait
            className={cn(
              "relative overflow-hidden rounded-[1.75rem] border border-border bg-surface-1",
              "shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]",
              !reduced && "opacity-0",
            )}
          >
            <div className="relative aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={PORTRAIT.src}
                alt={tAbout("portraitAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                preload
                className="object-cover object-[center_22%]"
              />
              {/* A whisper of acid at the top corner so the frame belongs to
                  the page — the photograph itself is left alone. */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 78% 58% at 14% 8%, rgba(184,243,0,0.14) 0%, transparent 62%)",
                  mixBlendMode: "soft-light",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent"
              />
            </div>

            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-5 pb-5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted sm:px-6 sm:pb-6">
              <span>{t("portraitMeta")}</span>
              <span className="text-accent/70">{tCommon("location")}</span>
            </figcaption>
          </figure>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border pt-4 sm:mt-11">
          <p
            data-hero-foot
            className={cn("font-mono text-[0.65rem] tracking-wide text-muted", !reduced && "opacity-0")}
          >
            {tCommon("location")}
          </p>
          <a
            href="#about"
            data-hero-foot
            onClick={(e) => {
              e.preventDefault();
              scrollToHash("#about");
            }}
            className={cn(
              "inline-flex min-h-11 items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent",
              !reduced && "opacity-0",
            )}
          >
            {t("scrollHint")}<span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
