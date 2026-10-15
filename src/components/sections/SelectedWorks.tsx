"use client";

import { useTranslations } from "next-intl";
import { ProjectEntry } from "@/components/work/ProjectEntry";
import { STACKED_ORDER } from "@/lib/projects";

export function SelectedWorks() {
  const t = useTranslations("work");
  return (
    <section id="work" className="scroll-mt-[var(--nav-height)] bg-background pb-16 pt-16 sm:pb-24 sm:pt-24" aria-label={t("headline")}>
      <div className="container-page space-y-16 sm:space-y-24">
        {STACKED_ORDER.map((id) => (
          <ProjectEntry key={id} id={id} />
        ))}
      </div>
    </section>
  );
}
