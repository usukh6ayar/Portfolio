"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PORTRAIT } from "@/lib/constants";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

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
 * Portrait + path + principles + focus + now.
 * Production section: calm, human, product-engineer tone.
 */
export function About() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const [portraitFailed, setPortraitFailed] = useState(!PORTRAIT.hasPortrait);

  const story = t.raw("story") as string[];
  const timeline = t.raw("timeline") as TimelineItem[];
  const focus = t.raw("focus") as string[];
  const principles = t.raw("principles") as Principle[];

  useEffect(() => {
    if (!isReady || !rootRef.current) return;

    const root = rootRef.current;
    const imageWrap = imageWrapRef.current;
    const imageInner = imageInnerRef.current;
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

    const ctx = gsap.context(() => {
      if (imageWrap) {
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
      }

      if (imageInner && imageWrap) {
        gsap.fromTo(
          imageInner,
          { y: -5 },
          {
            y: 5,
            ease: "none",
            scrollTrigger: {
              trigger: imageWrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
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
                  "relative aspect-[3/4] w-full overflow-hidden",
                  "rounded-[1.5rem] border border-border bg-surface-1",
                  !reduced && "opacity-0",
                )}
              >
                <div
                  ref={imageInnerRef}
                  className="absolute inset-[-2.5%] will-change-transform"
                >
                  {PORTRAIT.hasPortrait && !portraitFailed ? (
                    <Image
                      src={PORTRAIT.src}
                      alt={t("portraitAlt")}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover object-center"
                      onError={() => setPortraitFailed(true)}
                    />
                  ) : (
                    <PortraitPlaceholder />
                  )}
                </div>

                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-background/45 via-transparent to-background/5"
                  aria-hidden
                />
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

            <blockquote
              data-about-text
              className={cn(
                "relative mt-9 max-w-[32rem] border-l border-accent/55 pl-5 sm:mt-11 sm:pl-6",
                !reduced && "opacity-0",
              )}
            >
              <p className="font-display text-lg font-medium leading-snug tracking-tight text-foreground/95 sm:text-[1.25rem]">
                “{t("quote")}”
              </p>
            </blockquote>

            {/* Path */}
            <div
              data-about-block
              className={cn("mt-14 sm:mt-16", !reduced && "opacity-0")}
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

            {/* Focus */}
            <div
              data-about-block
              className={cn("mt-14 sm:mt-16", !reduced && "opacity-0")}
            >
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                  {t("focusLabel")}
                </p>
                <p className="font-mono text-[0.625rem] text-muted/75">
                  {t("focusHint")}
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {Array.isArray(focus) &&
                  focus.map((item) => (
                    <li key={item}>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-lg",
                          "border border-border bg-surface-1",
                          "px-3.5 py-2 text-sm tracking-tight text-foreground/90",
                          "transition-colors duration-300 hover:border-border-strong hover:bg-surface-2",
                        )}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Now */}
            <aside
              data-about-block
              className={cn(
                "mt-14 sm:mt-16",
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

function PortraitPlaceholder() {
  const t = useTranslations("about");

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end bg-surface-1"
      role="img"
      aria-label={t("portraitPlaceholder")}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 42% 28%, rgba(184, 243, 0, 0.05) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 72% 72%, rgba(167, 139, 250, 0.04) 0%, transparent 50%),
            linear-gradient(165deg, #161616 0%, #0e0e0e 48%, #111111 100%)
          `,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
        aria-hidden
      />
      <div className="relative z-10 p-6 sm:p-8">
        <p className="font-display text-4xl font-semibold tracking-tight text-foreground/20 sm:text-5xl">
          U
        </p>
        <p className="mt-3 max-w-[12rem] font-mono text-[0.625rem] leading-relaxed uppercase tracking-[0.12em] text-muted/80">
          {t("portraitPlaceholder")}
        </p>
      </div>
    </div>
  );
}
