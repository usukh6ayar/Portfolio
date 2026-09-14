"use client";

import { useTranslations } from "next-intl";
import { ProjectEntry } from "@/components/work/ProjectEntry";
import { FEATURED_ID } from "@/lib/projects";

export function FeaturedProject() {
  const t = useTranslations("work");

  return (
    <section id="featured" className="scroll-mt-[var(--nav-height)] bg-background py-16 sm:py-24" aria-labelledby={`work-title-${FEATURED_ID}`}>
      <div className="container-page">
        <div className="mb-8 flex items-center gap-4 border-t border-border pt-6 sm:mb-10">
          <span className="font-mono text-xs text-accent">01</span>
          <p className="text-caption text-muted">{t("featured.label")}</p>
        </div>
        <ProjectEntry id={FEATURED_ID} index={1} featured />
      </div>
    </section>
  );
}
