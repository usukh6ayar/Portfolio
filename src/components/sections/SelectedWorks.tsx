"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { ProjectLinks } from "@/components/work/ProjectLinks";
import { PROJECTS, STACKED_ORDER } from "@/lib/projects";

export function SelectedWorks() {
  const t = useTranslations("work");
  return (
    <section id="work" className="scroll-mt-[var(--nav-height)] bg-background pb-16 sm:pb-24" aria-labelledby="work-heading">
      <div className="container-page">
        <header className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-border pt-6 sm:mb-10">
          <h2 id="work-heading" className="text-caption text-muted">{t("headline")}</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">{t("intro")}</p>
        </header>
        <div className="space-y-14">
          {STACKED_ORDER.map((id, index) => {
            const title = t(`projects.${id}.title`);
            const stack = t.raw(`projects.${id}.stack`) as string[];
            return (
              <article key={id} className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14" aria-labelledby={`work-title-${id}`}>
                <Link href={PROJECTS[id].href} className="block rounded-3xl" aria-label={`${title} — ${t("viewCaseStudy")}`}>
                  <ProjectMedia id={id} title={title} size="card" showAction={false} />
                </Link>
                <div>
                  <p className="text-caption text-muted"><span className="mr-3 text-accent">{String(index + 2).padStart(2, "0")}</span>{t(`projects.${id}.category`)}<span className="mx-2 text-border-strong">/</span>{t(`projects.${id}.year`)}</p>
                  <h3 id={`work-title-${id}`} className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.035em]">
                    <Link href={PROJECTS[id].href} className="transition-colors hover:text-accent">{title}</Link>
                  </h3>
                  <p className="mt-5 max-w-lg text-base leading-[1.8] text-muted">{t(`projects.${id}.summary`)}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={t("stackLabel")}>
                    {stack.map((item) => <li key={item} className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.6875rem] text-muted">{item}</li>)}
                  </ul>
                  <Link href={PROJECTS[id].href} className="mt-8 inline-flex min-h-12 items-center gap-6 rounded-lg border border-border-strong px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent">
                    {t("viewCaseStudy")}<span aria-hidden>↗</span>
                  </Link>
                  <ProjectLinks id={id} only={["live", "repo"]} className="mt-5" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
