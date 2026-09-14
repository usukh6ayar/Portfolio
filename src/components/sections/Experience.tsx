"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EXPERIENCE, EXPERIENCE_ORDER } from "@/lib/experience";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type Role = {
  period: string;
  company: string;
  role: string;
  detail: string;
  tech?: string[];
};

/**
 * Where the work was done. The case studies prove capability; this answers the
 * question a client asks straight after — has anyone paid him to do this.
 *
 * Sits directly under Selected Work for that reason, and borrows the
 * Capabilities list geometry so the page keeps one rhythm rather than growing
 * a new layout per section.
 */
export function Experience() {
  const t = useTranslations("experience");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isReady || !rootRef.current || reduced) return;

    const root = rootRef.current;
    const parts = root.querySelectorAll<HTMLElement>("[data-experience-reveal]");

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
      id="experience"
      ref={rootRef}
      className="relative z-0 scroll-mt-[var(--nav-height)] border-t border-border bg-background pb-[var(--section-y)] pt-[var(--section-y)]"
      aria-labelledby="experience-heading"
    >
      <div className="container-page">
        <div className="max-w-xl">
          <p
            data-experience-reveal
            className={cn(
              "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted",
              !reduced && "opacity-0",
            )}
          >
            {t("label")}
          </p>
          <h2
            id="experience-heading"
            data-experience-reveal
            className={cn(
              "mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold tracking-[-0.035em] text-foreground",
              !reduced && "opacity-0",
            )}
          >
            {t("headline")}
          </h2>
          <p
            data-experience-reveal
            className={cn(
              "mt-4 text-[var(--text-body-sm)] leading-relaxed text-muted sm:text-base",
              !reduced && "opacity-0",
            )}
          >
            {t("intro")}
          </p>
        </div>

        <ul className="mt-12 divide-y divide-border border-t border-border sm:mt-16">
          {EXPERIENCE_ORDER.map((id) => {
            const meta = EXPERIENCE[id];
            const role = t.raw(`roles.${id}`) as Role;

            return (
              <li
                key={id}
                data-experience-reveal
                className={cn(
                  "grid grid-cols-1 gap-4 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10",
                  !reduced && "opacity-0",
                )}
              >
                <div className="sm:col-span-3">
                  <p
                    className={cn(
                      "font-mono text-[0.7rem] tabular-nums tracking-wide",
                      meta.current ? "text-accent" : "text-muted",
                    )}
                  >
                    {role.period}
                  </p>
                </div>

                <div className="sm:col-span-9">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
                    {role.role}
                  </h3>

                  <p className="mt-1 text-sm text-muted">
                    {meta.href ? (
                      <a
                        href={meta.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group/company inline-flex items-baseline gap-1.5 text-foreground transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        {role.company}
                        <span
                          aria-hidden
                          className="text-muted/60 transition-colors group-hover/company:text-accent"
                        >
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span className="text-foreground">{role.company}</span>
                    )}
                  </p>

                  <p className="mt-4 max-w-[42rem] text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                    {role.detail}
                  </p>

                  {Array.isArray(role.tech) && role.tech.length > 0 && (
                    <p className="mt-4 font-mono text-[0.65rem] tracking-wide text-muted/80">
                      {role.tech.join(" · ")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
