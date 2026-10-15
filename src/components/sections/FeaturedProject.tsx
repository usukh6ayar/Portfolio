"use client";

import { useTranslations } from "next-intl";
import { ProjectEntry } from "@/components/work/ProjectEntry";
import { FEATURED_ID } from "@/lib/projects";

/** The lead project. Its reel pins below the line that introduces the work. */
export function FeaturedProject() {
  const t = useTranslations("work");

  return (
    <section id="featured" className="scroll-mt-[var(--nav-height)] bg-background pt-16 sm:pt-24" aria-labelledby={`work-title-${FEATURED_ID}`}>
      <div className="container-page">
        <p className="max-w-[40rem] border-t border-border pt-6 text-base leading-[1.7] text-foreground/80">
          {t("intro")}
        </p>
        <div className="mt-10 sm:mt-14">
          <ProjectEntry id={FEATURED_ID} featured />
        </div>
      </div>
    </section>
  );
}
