"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  index: string;
  title: string;
  detail: string;
};

/**
 * How I work — what hiring me looks like, for a client who has not done this
 * before. A horizontal track on desktop because the steps are a sequence, not
 * a list; it stacks on narrow screens where a track would only mean scrolling
 * sideways.
 */
export function Process() {
  const t = useTranslations("process");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const steps = t.raw("steps") as Step[];

  useEffect(() => {
    if (!isReady || !rootRef.current || reduced) return;

    const root = rootRef.current;
    const parts = root.querySelectorAll<HTMLElement>("[data-process-reveal]");
    const rule = root.querySelector<HTMLElement>("[data-process-rule]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parts,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );

      // The rule draws left to right as the steps arrive — the one piece of
      // motion that carries meaning here, since the point is the sequence.
      if (rule) {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: rule, start: "top 86%", once: true },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced]);

  return (
    <section
      id="process"
      ref={rootRef}
      className="relative z-0 scroll-mt-[var(--nav-height)] border-t border-border bg-background py-[var(--section-y)]"
      aria-labelledby="process-heading"
    >
      <div className="container-page">
        <div className="max-w-xl">
          <p
            data-process-reveal
            className={cn(
              "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted",
              !reduced && "opacity-0",
            )}
          >
            {t("label")}
          </p>
          <h2
            id="process-heading"
            data-process-reveal
            className={cn(
              "mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold tracking-[-0.035em] text-foreground",
              !reduced && "opacity-0",
            )}
          >
            {t("headline")}
          </h2>
          <p
            data-process-reveal
            className={cn(
              "mt-4 text-[var(--text-body-sm)] leading-relaxed text-muted sm:text-base",
              !reduced && "opacity-0",
            )}
          >
            {t("intro")}
          </p>
        </div>

        <div
          data-process-rule
          aria-hidden
          className="mt-12 h-px w-full bg-border-strong sm:mt-16"
        />

        <ol className="grid gap-10 pt-8 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
          {Array.isArray(steps) &&
            steps.map((step) => (
              <li
                key={step.index}
                data-process-reveal
                className={cn(!reduced && "opacity-0")}
              >
                <span className="font-mono text-[0.7rem] tabular-nums tracking-wide text-accent">
                  {step.index}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.detail}
                </p>
              </li>
            ))}
        </ol>
      </div>
    </section>
  );
}
