"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type Capability = {
  index: string;
  title: string;
  description: string;
  tech: string[];
};

/**
 * Capabilities — what I build, not a tech badge wall.
 * Anchor remains #stack for nav compatibility.
 */
export function Skills() {
  const t = useTranslations("skills");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const groups = t.raw("groups") as Capability[];

  useEffect(() => {
    if (!isReady || !rootRef.current || reduced) return;

    const root = rootRef.current;
    const parts = root.querySelectorAll<HTMLElement>("[data-skills-reveal]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parts,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
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
      id="stack"
      ref={rootRef}
      className="relative z-0 scroll-mt-[var(--nav-height)] border-t border-border bg-background pb-[var(--section-y)] pt-[var(--section-y)]"
      aria-labelledby="skills-heading"
    >
      <div className="container-page">
        <div className="max-w-xl">
          <p
            data-skills-reveal
            className={cn(
              "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted",
              !reduced && "opacity-0",
            )}
          >
            {t("label")}
          </p>
          <h2
            id="skills-heading"
            data-skills-reveal
            className={cn(
              "mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold tracking-[-0.035em] text-foreground",
              !reduced && "opacity-0",
            )}
          >
            {t("headline")}
          </h2>
          <p
            data-skills-reveal
            className={cn(
              "mt-4 text-[var(--text-body-sm)] leading-relaxed text-muted sm:text-base",
              !reduced && "opacity-0",
            )}
          >
            {t("intro")}
          </p>
        </div>

        <ul className="mt-12 divide-y divide-border border-t border-border sm:mt-16">
          {Array.isArray(groups) &&
            groups.map((group) => (
              <li
                key={group.title}
                data-skills-reveal
                className={cn(
                  "grid grid-cols-1 gap-4 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10",
                  !reduced && "opacity-0",
                )}
              >
                <div className="sm:col-span-1">
                  <span className="font-mono text-[0.7rem] tabular-nums tracking-wide text-accent">
                    {group.index}
                  </span>
                </div>
                <div className="sm:col-span-4">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
                    {group.title}
                  </h3>
                </div>
                <div className="sm:col-span-7">
                  <p className="max-w-[34rem] text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                    {group.description}
                  </p>
                  {Array.isArray(group.tech) && (
                    <p className="mt-4 font-mono text-[0.65rem] tracking-wide text-muted/80">
                      {group.tech.join(" · ")}
                    </p>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
