"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { LATEST_SITE, challengePoster, challengeUrl } from "@/lib/challenge";

/**
 * Stand-in for the Challenge section while it has fewer than
 * MIN_CHALLENGE_ENTRIES sites: the newest one, as a single quiet card under
 * the project work. Static on purpose — nothing here waits on JS to appear.
 */
export function LatestWork() {
  const t = useTranslations("latestWork");
  const { locale } = useLocaleSwitch();
  const site = LATEST_SITE;
  if (!site) return null;

  return (
    <section
      id="latest"
      className="scroll-mt-[var(--nav-height)] bg-background pb-16 sm:pb-24"
      aria-labelledby="latest-heading"
    >
      <div className="container-page">
        <a
          href={challengeUrl(site)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-6 rounded-xl border border-border bg-surface-1 p-5 transition-colors hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-row sm:items-center sm:gap-8 sm:p-6"
        >
          <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-lg bg-surface-2 sm:w-32">
            <Image
              src={challengePoster(site)}
              alt=""
              fill
              sizes="128px"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
              {t("label")}
              <span className="text-muted/70"> · {site.business[locale]}</span>
            </p>
            <h2
              id="latest-heading"
              className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground"
            >
              {site.title[locale]}
            </h2>
            <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-muted">
              {site.tagline[locale]}
            </p>
            <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
              {site.tech.join(" · ")}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-[0.9375rem] text-foreground transition-colors group-hover:text-accent">
            {t("open")}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              ↗
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
