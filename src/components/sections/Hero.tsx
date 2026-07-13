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
 * Hero — production entry to the portfolio.
 * Typography is the design. Motion hierarchy only.
 * Does not own other sections.
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
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // 1 — status + role (quiet orientation)
      tl.fromTo(
        intro,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 },
        0.08,
      );

      // 2 — name + statement (primary visual weight)
      tl.fromTo(
        lines,
        { yPercent: 105, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.075,
        },
        "-=0.2",
      );

      // 3 — supporting copy
      tl.fromTo(
        body,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55 },
        "-=0.4",
      );

      // 4 — actions
      tl.fromTo(
        ctas,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
        "-=0.3",
      );

      // 5 — index strip (calm close)
      tl.fromTo(
        foot,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.04 },
        "-=0.2",
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
        {/* —— Intro meta —— */}
        <div className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2.5 sm:mb-9 md:mb-11">
          <div data-hero-intro className={cn(!reduced && "opacity-0")}>
            <StatusPill />
          </div>
          <p
            data-hero-intro
            className={cn(
              "font-mono text-[0.7rem] tracking-[0.04em] text-muted",
              !reduced && "opacity-0",
            )}
          >
            <span className="text-foreground/75">{tCommon("location")}</span>
            <span className="mx-2 text-border-strong" aria-hidden>
              ·
            </span>
            <span>{t("eduMeta")}</span>
          </p>
        </div>

        {/* —— Display block —— */}
        <div className="max-w-[min(100%,52rem)]">
          <p
            data-hero-intro
            className={cn(
              "mb-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted sm:mb-5",
              !reduced && "opacity-0",
            )}
          >
            {t("roleLabel")}
          </p>

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
              "mt-6 max-w-[28rem] text-[0.9375rem] leading-[1.7] text-muted sm:mt-7 sm:text-base sm:leading-[1.7]",
              !reduced && "opacity-0",
            )}
          >
            {t("subcopy")}
          </p>
        </div>

        {/* —— CTAs —— */}
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
          <p
            data-hero-cta
            className={cn(
              "w-full pt-1 font-mono text-[0.6875rem] tracking-wide text-muted sm:w-auto sm:pt-0 sm:pl-1",
              !reduced && "opacity-0",
            )}
          >
            <span className="text-accent-secondary" aria-hidden>
              →
            </span>{" "}
            {t("stackHint")}
          </p>
        </div>

        {/* —— Index strip —— */}
        <div
          className={cn(
            "mt-14 flex flex-col gap-6 border-t border-border pt-6",
            "sm:mt-16 sm:flex-row sm:items-end sm:justify-between sm:gap-8",
            "md:mt-20 md:pt-7",
          )}
        >
          <dl className="flex flex-wrap gap-x-10 gap-y-5 sm:gap-x-12">
            <MetaStat
              label={t("stats.focusLabel")}
              value={t("stats.focusValue")}
              reduced={reduced}
            />
            <MetaStat
              label={t("stats.basedLabel")}
              value={t("stats.basedValue")}
              reduced={reduced}
            />
            <MetaStat
              label={t("stats.companyLabel")}
              value={t("stats.companyValue")}
              reduced={reduced}
            />
          </dl>

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
    </section>
  );
}

function MetaStat({
  label,
  value,
  reduced,
}: {
  label: string;
  value: string;
  reduced: boolean;
}) {
  return (
    <div data-hero-foot className={cn(!reduced && "opacity-0")}>
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm tracking-tight text-foreground/90">
        {value}
      </dd>
    </div>
  );
}
