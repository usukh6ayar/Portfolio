"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { scrollToHash } from "@/components/providers/LenisProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * A full-width name anchors a compact, two-column introduction.
 */
export function Hero() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
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

    if (reduced) {
      gsap.set([intro, lines, body, ctas, foot], {
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
        intro,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 },
        0.08,
      )
        .fromTo(
          lines,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.075 },
          "-=0.2",
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

      <div className="container-page relative z-10 [container-type:inline-size]">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:mb-8">
          <div data-hero-intro className={cn(!reduced && "opacity-0")}>
            <StatusPill />
          </div>
          <p
            data-hero-intro
            className={cn(
              "font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted",
              !reduced && "opacity-0",
            )}
          >
            {t("roleLabel")}
          </p>
        </div>

        <h1
          id="hero-heading"
          className="font-display text-[clamp(2.5rem,15cqw,14rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-foreground"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-line className={cn("block", !reduced && "opacity-0")}>
              {tCommon("name")}
            </span>
          </span>
        </h1>

        <div className="mt-7 grid gap-7 sm:mt-9 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-10 lg:mt-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <p className="font-display text-[clamp(1.5rem,3vw,2.75rem)] font-medium leading-[1.2] tracking-[-0.035em] text-foreground/90">
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

          <div className="md:pb-1">
            <p
              data-hero-body
              className={cn(
                "max-w-[34rem] text-[0.9375rem] leading-[1.75] text-muted sm:text-base",
                !reduced && "opacity-0",
              )}
            >
              {t("subcopy")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
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
