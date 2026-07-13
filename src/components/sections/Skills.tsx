"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type SkillGroup = {
  title: string;
  items: string[];
};

/**
 * Skills / stack — visual product labels, not a résumé list.
 */
export function Skills() {
  const t = useTranslations("skills");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const groups = t.raw("groups") as SkillGroup[];

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
          stagger: 0.06,
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
      className="relative z-0 scroll-mt-[var(--nav-height)] bg-background pb-[var(--section-y)] pt-4 sm:pt-6"
      aria-labelledby="skills-heading"
    >
      <div className="container-page">
        <div className="max-w-xl">
          <h2 id="skills-heading" className="sr-only">
            {t("headline")}
          </h2>
          <p
            data-skills-reveal
            className={cn(
              "text-[var(--text-body-sm)] leading-relaxed text-muted sm:text-base",
              !reduced && "opacity-0",
            )}
          >
            {t("intro")}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {Array.isArray(groups) &&
            groups.map((group) => (
              <li
                key={group.title}
                data-skills-reveal
                className={cn(
                  "rounded-[1.15rem] border border-border bg-surface-1 p-6",
                  !reduced && "opacity-0",
                )}
              >
                <p className="text-caption text-muted">{group.title}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-t border-border pt-2.5 text-sm tracking-tight text-foreground/90 first:border-t-0 first:pt-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
