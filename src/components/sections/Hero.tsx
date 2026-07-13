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
 * Hero — who / what / next action only.
 * Education, founder detail, dense meta live in About.
 */
export function Hero() {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isReady || !rootRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

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
      className={cn(
        "relative flex min-h-[100dvh] flex-col",
        "justify-end md:justify-center",
        "pb-14 pt-[calc(var(--nav-height)+1.75rem)]",
        "sm:pb-16 sm:pt-[calc(var(--nav-height)+2.25rem)]",
        "md:pb-20 md:pt-[var(--nav-height)]",
        "lg:pb-24",
      )}
      aria-labelledby="hero-heading"
    >
      <div className="ambient-glow" aria-hidden />

      <div className="container-page relative z-10 w-full">
        <div className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2.5 sm:mb-9 md:mb-11">
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

        <div className="max-w-[min(100%,52rem)]">
          <h1
            id="hero-heading"
            className="font-display text-[clamp(3rem,11vw,7.25rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-foreground"
          >
            <span className="block overflow-hidden pb-[0.05em]">
              <span
                data-hero-line
                className={cn("block", !reduced && "opacity-0")}
              >
                {tCommon("name")}
              </span>
            </span>
          </h1>

          <div className="mt-5 max-w-[36rem] sm:mt-6 md:mt-8">
            <p className="font-display text-[clamp(1.35rem,3.4vw,2.35rem)] font-medium leading-[1.18] tracking-[-0.03em] text-foreground/90">
              <span className="block overflow-hidden">
                <span
                  data-hero-line
                  className={cn("block", !reduced && "opacity-0")}
                >
                  {t("statement.line1")}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  data-hero-line
                  className={cn("block", !reduced && "opacity-0")}
                >
                  {t("statement.line2Before")}
                  <span className="text-accent">
                    {t("statement.line2Accent")}
                  </span>
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  data-hero-line
                  className={cn("block", !reduced && "opacity-0")}
                >
                  {t("statement.line3")}
                </span>
              </span>
            </p>
          </div>

          <p
            data-hero-body
            className={cn(
              "mt-6 max-w-[26rem] text-[0.9375rem] leading-[1.7] text-muted sm:mt-7 sm:text-base",
              !reduced && "opacity-0",
            )}
          >
            {t("subcopy")}
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11 sm:gap-4">
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

        <div className="mt-14 border-t border-border pt-6 sm:mt-16 md:mt-20 md:pt-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p
              data-hero-foot
              className={cn(
                "font-mono text-[0.65rem] tracking-wide text-muted",
                !reduced && "opacity-0",
              )}
            >
              {tCommon("location")}
            </p>
            <p
              data-hero-foot
              className={cn(
                "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted",
                !reduced && "opacity-0",
              )}
              aria-hidden
            >
              {t("scrollHint")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
