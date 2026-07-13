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

/**
 * Editorial story — why I build, not a résumé.
 * Portrait layout is stable; swap asset via PORTRAIT.hasPortrait.
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
  const principles = t.raw("principles") as Array<{
    title: string;
    detail: string;
  }>;

  useEffect(() => {
    if (!isReady || !rootRef.current) return;

    const root = rootRef.current;
    const revealEls = root.querySelectorAll<HTMLElement>("[data-about-reveal]");
    const imageWrap = imageWrapRef.current;
    const imageInner = imageInnerRef.current;

    if (reduced) {
      gsap.set(revealEls, { opacity: 1, y: 0, clearProps: "transform" });
      if (imageWrap) gsap.set(imageWrap, { opacity: 1, clearProps: "clip-path" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        revealEls,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        },
      );

      if (imageWrap) {
        gsap.fromTo(
          imageWrap,
          { opacity: 0, clipPath: "inset(8% 8% 8% 8% round 24px)" },
          {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0% round 24px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imageWrap,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      if (imageInner && imageWrap) {
        gsap.fromTo(
          imageInner,
          { y: -6 },
          {
            y: 6,
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
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced]);

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative z-0 scroll-mt-[var(--nav-height)] bg-background pb-[var(--section-y)] pt-4 sm:pt-6"
      aria-labelledby="about-heading"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-10 lg:gap-16 xl:gap-20">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)]">
              <div
                ref={imageWrapRef}
                className={cn(
                  "relative aspect-[3/4] w-full overflow-hidden",
                  "rounded-[1.35rem] sm:rounded-[1.5rem]",
                  "border border-border bg-surface-1",
                  !reduced && "opacity-0",
                )}
              >
                <div
                  ref={imageInnerRef}
                  className="absolute inset-[-3%] will-change-transform"
                >
                  {PORTRAIT.hasPortrait && !portraitFailed ? (
                    <Image
                      src={PORTRAIT.src}
                      alt={t("portraitAlt")}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-center"
                      onError={() => setPortraitFailed(true)}
                    />
                  ) : (
                    <PortraitPlaceholder />
                  )}
                </div>

                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-background/40 via-transparent to-background/5"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.04]"
                  aria-hidden
                />
              </div>

              <p
                data-about-reveal
                className="mt-4 flex items-center justify-between gap-4 opacity-0"
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                  {tCommon("location")}
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                  {t("portraitMeta")}
                </span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pt-2">
            {/* Label + large title already previewed by SectionBridge */}
            <h2
              id="about-heading"
              data-about-reveal
              className="opacity-0 max-w-[18ch] font-display text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground"
            >
              {t("headline")}
            </h2>

            <div className="mt-8 space-y-5 sm:mt-10">
              <p
                data-about-reveal
                className="opacity-0 max-w-[36rem] text-[1.05rem] leading-[1.7] text-foreground/90 sm:text-[1.075rem]"
              >
                {t("intro")}
              </p>
              {Array.isArray(story) &&
                story.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    data-about-reveal
                    className="opacity-0 max-w-[36rem] text-[var(--text-body-sm)] leading-[1.7] text-muted sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>

            <blockquote
              data-about-reveal
              className="opacity-0 relative mt-10 max-w-[34rem] border-l border-accent/60 pl-5 sm:mt-12 sm:pl-6"
            >
              <p className="font-display text-lg font-medium leading-snug tracking-tight text-foreground/95 sm:text-xl">
                “{t("quote")}”
              </p>
            </blockquote>

            <div data-about-reveal className="opacity-0 mt-14 sm:mt-16">
              <p className="mb-6 text-caption text-muted">{t("pathLabel")}</p>
              <ol className="relative">
                {Array.isArray(timeline) &&
                  timeline.map((item, index) => {
                    const isLast = index === timeline.length - 1;
                    const isToday =
                      item.year === "Today" || item.year === "Одоо";
                    return (
                      <li
                        key={`${item.year}-${index}`}
                        className="relative grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[5.5rem_1fr] sm:gap-6"
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
                              className="ml-[0.35rem] mt-2 min-h-[2.25rem] w-px flex-1 bg-border"
                              aria-hidden
                            />
                          )}
                        </div>
                        <div className={cn("pb-8", isLast && "pb-0")}>
                          <p className="text-[0.95rem] font-medium tracking-tight text-foreground">
                            {item.title}
                          </p>
                          <p className="mt-1 max-w-[30rem] text-sm leading-relaxed text-muted">
                            {item.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
              </ol>
            </div>

            {/* Principles */}
            <div data-about-reveal className="opacity-0 mt-14 sm:mt-16">
              <p className="mb-6 text-caption text-muted">
                {t("principlesLabel")}
              </p>
              <ul className="space-y-6">
                {Array.isArray(principles) &&
                  principles.map((item) => (
                    <li
                      key={item.title}
                      className="border-t border-border pt-5 first:border-t-0 first:pt-0"
                    >
                      <p className="text-[0.95rem] font-medium tracking-tight text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1.5 max-w-[30rem] text-sm leading-relaxed text-muted">
                        {item.detail}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Current focus */}
            <div data-about-reveal className="opacity-0 mt-14 sm:mt-16">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-4">
                <p className="text-caption text-muted">{t("focusLabel")}</p>
                <p className="font-mono text-[0.65rem] text-muted/80">
                  {t("focusHint")}
                </p>
              </div>
              <ul className="flex flex-wrap gap-2 sm:gap-2.5">
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

            {/* Now card */}
            <div
              data-about-reveal
              className={cn(
                "opacity-0 mt-14 sm:mt-16",
                "rounded-[1.25rem] border border-border bg-surface-1 p-6 sm:p-7",
              )}
            >
              <p className="text-caption text-accent">{t("nowLabel")}</p>
              <p className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {t("nowTitle")}
              </p>
              <p className="mt-3 max-w-[32rem] text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                {t("nowBody")}
              </p>
              <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
                {t("nowMeta")}
              </p>
            </div>
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
            radial-gradient(ellipse 80% 55% at 42% 28%, rgba(184, 243, 0, 0.06) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 70% 70%, rgba(167, 139, 250, 0.05) 0%, transparent 50%),
            linear-gradient(165deg, #161616 0%, #0e0e0e 45%, #111111 100%)
          `,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
        aria-hidden
      />
      <div className="relative z-10 p-6 sm:p-8">
        <p className="font-display text-4xl font-semibold tracking-tight text-foreground/25 sm:text-5xl">
          U
        </p>
        <p className="mt-3 max-w-[14rem] font-mono text-[0.65rem] leading-relaxed uppercase tracking-[0.12em] text-muted">
          {t("portraitPlaceholder")}
          <br />
          <span className="normal-case tracking-normal text-muted/70">
            {t("portraitPath")}
          </span>
        </p>
      </div>
    </div>
  );
}
