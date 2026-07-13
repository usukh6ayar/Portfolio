"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HoverFollowLabel } from "@/components/ui/HoverFollowLabel";
import { FEATURED_ID, PROJECTS } from "@/lib/projects";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/**
 * Flagship project — SparkXP.
 * Standalone editorial block. Not part of the sticky stack.
 * Hierarchy: this is clearly the most important work.
 */
export function FeaturedProject() {
  const t = useTranslations("work");
  const tCursor = useTranslations("cursor");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const id = FEATURED_ID;
  const href = PROJECTS[id].href;
  const stack = t.raw("featured.stack") as string[];

  useEffect(() => {
    if (!isReady || !rootRef.current || reduced) return;

    const root = rootRef.current;
    const parts = root.querySelectorAll<HTMLElement>("[data-featured-part]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parts,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced]);

  return (
    <section
      id="featured"
      ref={rootRef}
      className="relative scroll-mt-[var(--nav-height)] bg-background"
      aria-labelledby="featured-title"
    >
      <div className="container-page pb-20 pt-4 sm:pb-24 sm:pt-6 md:pb-28 lg:pb-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p
              data-featured-part
              className={cn(
                "font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted",
                !reduced && "opacity-0",
              )}
            >
              <span className="text-accent">01</span>
              <span className="mx-2 text-border-strong">·</span>
              {t("featured.category")}
              <span className="mx-2 text-border-strong">·</span>
              {t("featured.year")}
            </p>

            <motion.h2
              layoutId={`project-title-${id}`}
              id="featured-title"
              data-featured-part
              className={cn(
                "mt-4 font-display text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-foreground",
                !reduced && "opacity-0",
              )}
            >
              <Link
                href={href}
                className="transition-colors duration-300 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {t("featured.title")}
              </Link>
            </motion.h2>

            <p
              data-featured-part
              className={cn(
                "mt-6 max-w-[36rem] text-base leading-[1.7] text-muted sm:text-lg",
                !reduced && "opacity-0",
              )}
            >
              {t("featured.summary")}
            </p>
          </div>
        </div>

        {/* Hero screenshot — dominant visual */}
        <div
          data-featured-part
          className={cn("mt-12 sm:mt-14 md:mt-16", !reduced && "opacity-0")}
        >
          <HoverFollowLabel label={tCursor("explore")} className="block">
            <Link href={href} className="block" aria-label={t("viewCaseStudy")}>
              <ProjectMedia
                id={id}
                title={t("featured.title")}
                size="hero"
                priority
                cursorLabel={false}
              />
            </Link>
          </HoverFollowLabel>
        </div>

        {/* Problem / Solution / Outcome / Tech */}
        <div
          data-featured-part
          className={cn(
            "mt-14 grid grid-cols-1 gap-10 border-t border-border pt-12 md:mt-16 md:grid-cols-2 md:gap-x-12 md:gap-y-12 lg:grid-cols-4",
            !reduced && "opacity-0",
          )}
        >
          <div>
            <p className="text-caption text-muted">{t("problem")}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-[0.9375rem]">
              {t("featured.problem")}
            </p>
          </div>
          <div>
            <p className="text-caption text-muted">{t("solution")}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-[0.9375rem]">
              {t("featured.solution")}
            </p>
          </div>
          <div>
            <p className="text-caption text-muted">{t("outcome")}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
              {t("featured.outcome")}
            </p>
          </div>
          <div>
            <p className="text-caption text-muted">{t("stackLabel")}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {Array.isArray(stack) &&
                stack.map((item) => (
                  <li key={item}>
                    <span className="inline-flex rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-muted">
                      {item}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div
          data-featured-part
          className={cn("mt-12 sm:mt-14", !reduced && "opacity-0")}
        >
          <MagneticButton href={href} variant="primary">
            {t("viewCaseStudy")}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
