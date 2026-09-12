"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { ProjectLinks } from "@/components/work/ProjectLinks";
import { FEATURED_ID, PROJECTS } from "@/lib/projects";

export function FeaturedProject() {
  const t = useTranslations("work");
  const id = FEATURED_ID;
  const stack = t.raw("featured.stack") as string[];

  return (
    <section id="featured" className="scroll-mt-[var(--nav-height)] bg-background py-16 sm:py-24" aria-labelledby="featured-title">
      <div className="container-page">
        <div className="mb-8 flex items-center gap-4 border-t border-border pt-6 sm:mb-10">
          <span className="font-mono text-xs text-accent">01</span>
          <p className="text-caption text-muted">{t("featured.label")}</p>
        </div>
        <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <Link href={PROJECTS[id].href} className="block rounded-3xl" aria-label={`${t("featured.title")} — ${t("viewCaseStudy")}`}>
            <ProjectMedia id={id} title={t("featured.title")} size="card" showAction={false} />
          </Link>
          <div>
            <p className="text-caption text-muted">{t("featured.category")}<span className="mx-2 text-border-strong">/</span>{t("featured.year")}</p>
            <h2 id="featured-title" className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
              <Link href={PROJECTS[id].href} className="transition-colors hover:text-accent">{t("featured.title")}</Link>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-[1.8] text-muted">{t("featured.summary")}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={t("stackLabel")}>
              {stack.map((item) => <li key={item} className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.6875rem] text-muted">{item}</li>)}
            </ul>
            <Link href={PROJECTS[id].href} className="mt-8 inline-flex min-h-12 items-center gap-6 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-foreground">
              {t("viewCaseStudy")}<span aria-hidden>↗</span>
            </Link>
            <ProjectLinks id={id} only={["live", "repo"]} className="mt-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
