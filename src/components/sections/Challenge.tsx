"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextLink } from "@/components/ui/TextLink";
import { scrollToHash } from "@/components/providers/LenisProvider";
import {
  CHALLENGE_TOTAL,
  LIVE_SITES,
  challengePoster,
  challengeUrl,
  formatSiteNumber,
  type ChallengeSite,
} from "@/lib/challenge";
import { DIRECT_CONTACT } from "@/lib/constants";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/**
 * Challenge — the 30-site series, in the open.
 *
 * Sits right under the case studies: those prove the engineering, this proves
 * the craft that people arriving from a reel came to see. The 30-cell meter is
 * the section's one signature element; everything else follows Services.
 */
export function Challenge() {
  const t = useTranslations("challenge");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const done = LIVE_SITES.length;

  useEffect(() => {
    if (!isReady || !rootRef.current || reduced) return;
    const root = rootRef.current;
    const parts = root.querySelectorAll<HTMLElement>("[data-challenge-reveal]");
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
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [isReady, reduced]);

  const hidden = !reduced && "opacity-0";

  return (
    <section
      id="challenge"
      ref={rootRef}
      className="relative z-0 scroll-mt-[var(--nav-height)] border-t border-border bg-background py-[var(--section-y)]"
      aria-labelledby="challenge-heading"
    >
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="max-w-xl lg:col-span-7">
            <p
              data-challenge-reveal
              className={cn(
                "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted",
                hidden,
              )}
            >
              {t("label")}
            </p>
            <h2
              id="challenge-heading"
              data-challenge-reveal
              className={cn(
                "mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground",
                hidden,
              )}
            >
              {t("headline")}
            </h2>
            <p
              data-challenge-reveal
              className={cn(
                "mt-4 text-[var(--text-body-sm)] leading-relaxed text-muted sm:text-base",
                hidden,
              )}
            >
              {t("intro")}
            </p>
          </div>

          <div data-challenge-reveal className={cn("lg:col-span-5", hidden)}>
            <p className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums text-foreground">
              {formatSiteNumber(done)}
              <span className="text-muted">/{CHALLENGE_TOTAL}</span>
            </p>
            <Meter done={done} />
            <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
              {t("progress", { done, total: CHALLENGE_TOTAL })}
            </p>
          </div>
        </div>

        {done > 0 ? (
          <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {LIVE_SITES.map((site) => (
              <SiteCard key={site.slug} site={site} hiddenClass={hidden} />
            ))}
            <UpNext done={done} next={Math.max(...LIVE_SITES.map((s) => s.n)) + 1} hiddenClass={hidden} />
          </ul>
        ) : (
          <div
            data-challenge-reveal
            className={cn(
              "mt-12 flex flex-col gap-4 rounded-xl border border-dashed border-border-strong p-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:p-9",
              hidden,
            )}
          >
            <div className="max-w-md">
              <p className="font-mono text-[0.7rem] tabular-nums tracking-wide text-accent">
                #{formatSiteNumber(1)}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground">
                {t("soonTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t("soonBody")}
              </p>
            </div>
            <TextLink
              href={DIRECT_CONTACT.instagramProfile}
              external
              arrow
              className="text-[0.9375rem]"
            >
              {t("follow")} · {DIRECT_CONTACT.instagramHandle}
            </TextLink>
          </div>
        )}

        <div
          data-challenge-reveal
          className={cn(
            "mt-10 flex flex-col items-start gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-6",
            hidden,
          )}
        >
          <p className="text-[0.9375rem] text-foreground/85">{t("cta")}</p>
          <MagneticButton
            href="#contact"
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              scrollToHash("#contact");
            }}
          >
            {t("ctaButton")}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

/** 30 cells, one per site; filled cells are live. */
function Meter({ done }: { done: number }) {
  return (
    <div
      className="mt-5 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1"
      role="img"
      aria-label={`${done} / ${CHALLENGE_TOTAL}`}
    >
      {Array.from({ length: CHALLENGE_TOTAL }, (_, i) => (
        <span
          key={i}
          className={cn(
            "aspect-square rounded-[3px]",
            i < done ? "bg-accent" : "bg-surface-2",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Quiet "up next" cells that close the last row of the grid, so a row that
 * isn't full yet never shows the bare grid background. Two columns from sm,
 * three from lg; nothing on phones, where the list is a single column.
 */
function UpNext({ done, next, hiddenClass }: { done: number; next: number; hiddenClass: string | false }) {
  const t = useTranslations("challenge");
  const sm = done % 2 ? 1 : 0;
  const lg = (3 - (done % 3)) % 3;
  if (next > CHALLENGE_TOTAL) return null;
  return [0, 1].map((i) => {
    if (i >= sm && i >= lg) return null;
    const show = cn("hidden", i < sm ? "sm:flex" : "sm:hidden", i < lg ? "lg:flex" : "lg:hidden");
    return (
      <li key={i} data-challenge-reveal aria-hidden={i > 0} className={cn(show, "flex-col justify-end gap-2 bg-background p-6", hiddenClass)}>
        {i === 0 && (
          <>
            <span className="font-mono text-[0.7rem] tabular-nums tracking-wide text-muted">
              #{formatSiteNumber(next)}
            </span>
            <p className="font-display text-lg font-semibold tracking-tight text-foreground/50">{t("upNext")}</p>
          </>
        )}
      </li>
    );
  });
}

function SiteCard({
  site,
  hiddenClass,
}: {
  site: ChallengeSite;
  hiddenClass: string | false;
}) {
  const t = useTranslations("challenge");
  const title = t(`sites.${site.slug}.title`);
  const tagline = t(`sites.${site.slug}.tagline`);

  return (
    <li data-challenge-reveal className={cn("bg-background", hiddenClass)}>
      <a
        href={challengeUrl(site)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/5] w-full max-w-full overflow-hidden bg-surface-1">
          <Image
            src={challengePoster(site)}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          {site.reel && (
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              src={site.reel}
              muted
              loop
              playsInline
              preload="none"
              onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <span className="font-mono text-[0.7rem] tabular-nums tracking-wide text-accent">
            #{formatSiteNumber(site.n)}
          </span>
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{tagline}</p>
          <p className="mt-auto flex items-center justify-between gap-3 pt-3 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
            <span>{site.tech.join(" · ")}</span>
            <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-x-0.5">
              ↗
            </span>
          </p>
        </div>
      </a>
    </li>
  );
}
