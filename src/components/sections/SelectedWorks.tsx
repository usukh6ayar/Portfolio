"use client";

import { useTranslations } from "next-intl";
import { ProjectEntry } from "@/components/work/ProjectEntry";
import { STACKED_ORDER } from "@/lib/projects";

export function SelectedWorks() {
  const t = useTranslations("work");
  return (
    <section id="work" className="scroll-mt-[var(--nav-height)] bg-background pb-16 sm:pb-24" aria-labelledby="work-heading">
      <div className="container-page">
        <header className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-border pt-6 sm:mb-10">
          <p id="work-heading" className="text-caption text-muted">{t("headline")}</p>
          <p className="max-w-md text-sm leading-relaxed text-muted">{t("intro")}</p>
        </header>
        <div className="space-y-14">
          {STACKED_ORDER.map((id, index) => {
            return (
              <ProjectEntry key={id} id={id} index={index + 2} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
