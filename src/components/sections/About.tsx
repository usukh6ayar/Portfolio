"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/** three + R3F is ~600 KB — off the server, and only once it is near. */
const AboutObject = dynamic(
  () => import("@/components/ui/AboutObject").then((m) => m.AboutObject),
  { ssr: false },
);

function LazyObject() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || near) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setNear(true), 0);
      return () => clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [near]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {near && <AboutObject className="h-full w-full" />}
    </div>
  );
}

type TimelineItem = {
  year: string;
  title: string;
  detail: string;
};

type Principle = {
  title: string;
  detail: string;
};

/**
 * About — editorial story before any work.
 * Portrait · Story · Timeline · Principles · Now
 */
export function About() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const story = t.raw("story") as string[];
  const timeline = t.raw("timeline") as TimelineItem[];
  const principles = t.raw("principles") as Principle[];

  useEffect(() => {
    if (!isReady || !rootRef.current) return;

    const root = rootRef.current;
    const imageWrap = imageWrapRef.current;
    const textBlocks = root.querySelectorAll<HTMLElement>("[data-about-text]");
    const blocks = root.querySelectorAll<HTMLElement>("[data-about-block]");

    if (reduced) {
      gsap.set([textBlocks, blocks, imageWrap].filter(Boolean), {
        opacity: 1,
        y: 0,
        clearProps: "clipPath,transform",
      });
      return;
    }

    // Continuous scrub parallax only on fine-pointer desktops
    const canParallax = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    const ctx = gsap.context(() => {
      if (imageWrap) {
        // Desktop: soft mask reveal. Mobile: opacity/transform only.
        if (canParallax) {
          gsap.fromTo(
            imageWrap,
            { opacity: 0, clipPath: "inset(8% 8% 8% 8% round 24px)" },
            {
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              duration: 1.05,
              ease: "power3.out",
              scrollTrigger: {
                trigger: imageWrap,
                start: "top 86%",
                once: true,
              },
            },
          );
        } else {
          gsap.fromTo(
            imageWrap,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: imageWrap,
                start: "top 88%",
                once: true,
              },
            },
          );
        }
      }


      gsap.fromTo(
        textBlocks,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 76%",
            once: true,
          },
        },
      );

      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced]);

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative z-0 scroll-mt-[var(--nav-height)] bg-background pb-[var(--section-y)] pt-2 sm:pt-4"
      aria-labelledby="about-heading"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* —— Portrait —— */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+1.75rem)]">
              <div
                ref={imageWrapRef}
                className={cn(
                  "relative aspect-square w-full overflow-hidden",
                  "rounded-[1.5rem] border border-border bg-surface-1",
                  !reduced && "opacity-0",
                )}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_42%,rgba(184,243,0,0.07),transparent_72%)]"
                />
                <LazyObject />

                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.04]"
                  aria-hidden
                />
              </div>

              <div
                data-about-text
                className={cn(
                  "mt-4 flex items-center justify-between gap-4",
                  !reduced && "opacity-0",
                )}
              >
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                  {tCommon("location")}
                </p>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                  {t("portraitMeta")}
                </p>
              </div>
            </div>
          </div>

          {/* —— Story column —— */}
          <div className="lg:col-span-7 lg:pt-1">
            <h2
              id="about-heading"
              data-about-text
              className={cn(
                "max-w-[16ch] font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground",
                !reduced && "opacity-0",
              )}
            >
              {t("headline")}
            </h2>

            <div className="mt-7 space-y-4 sm:mt-8 sm:space-y-5">
              <p
                data-about-text
                className={cn(
                  "max-w-[34rem] text-[1.05rem] leading-[1.7] text-foreground/90 sm:text-[1.0625rem]",
                  !reduced && "opacity-0",
                )}
              >
                {t("intro")}
              </p>
              {Array.isArray(story) &&
                story.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    data-about-text
                    className={cn(
                      "max-w-[34rem] text-[0.9375rem] leading-[1.7] text-muted sm:text-base",
                      !reduced && "opacity-0",
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
            </div>

            {/* Path */}
            <div
              data-about-block
              className={cn("mt-12 sm:mt-14", !reduced && "opacity-0")}
            >
              <p className="mb-6 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                {t("pathLabel")}
              </p>
              <ol className="relative">
                {Array.isArray(timeline) &&
                  timeline.map((item, index) => {
                    const isLast = index === timeline.length - 1;
                    const isToday =
                      item.year === "Today" || item.year === "Одоо";
                    return (
                      <li
                        key={`${item.year}-${item.title}`}
                        className="relative grid grid-cols-[4.25rem_1fr] gap-3 sm:grid-cols-[5rem_1fr] sm:gap-5"
                      >
                        <div className="relative flex flex-col items-start">
                          <span
                            className={cn(
                              "font-mono text-[0.7rem] tabular-nums tracking-wide",
                              isToday ? "text-accent" : "text-muted",
                            )}
                          >
                            {item.year}
                          </span>
                          {!isLast && (
                            <span
                              className="ml-[0.35rem] mt-2 min-h-[2.5rem] w-px flex-1 bg-border"
                              aria-hidden
                            />
                          )}
                        </div>
                        <div className={cn("pb-7", isLast && "pb-0")}>
                          <p className="text-[0.9375rem] font-medium tracking-tight text-foreground">
                            {item.title}
                          </p>
                          <p className="mt-1 max-w-[28rem] text-sm leading-relaxed text-muted">
                            {item.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
              </ol>
            </div>

            {/* Principles */}
            <div
              data-about-block
              className={cn("mt-14 sm:mt-16", !reduced && "opacity-0")}
            >
              <p className="mb-5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                {t("principlesLabel")}
              </p>
              <ul className="divide-y divide-border border-t border-border">
                {Array.isArray(principles) &&
                  principles.map((item) => (
                    <li key={item.title} className="py-5 first:pt-5">
                      <p className="text-[0.9375rem] font-medium tracking-tight text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1.5 max-w-[28rem] text-sm leading-relaxed text-muted">
                        {item.detail}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Now */}
            <aside
              data-about-block
              className={cn(
                "mt-12 sm:mt-14",
                "rounded-[1.35rem] border border-border bg-surface-1 p-6 sm:p-7",
                !reduced && "opacity-0",
              )}
              aria-label={t("nowLabel")}
            >
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
                {t("nowLabel")}
              </p>
              <p className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
                {t("nowTitle")}
              </p>
              <p className="mt-3 max-w-[30rem] text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                {t("nowBody")}
              </p>
              <p className="mt-5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">
                {t("nowMeta")}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
