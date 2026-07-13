"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import type { ProjectId } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";
import { EASE } from "@/lib/easings";

type CaseStudyViewProps = {
  id: ProjectId;
};

export function CaseStudyView({ id }: CaseStudyViewProps) {
  const t = useTranslations("work");
  const tc = useTranslations("work.caseStudy");
  const project = PROJECTS[id];
  const title = t(`projects.${id}.title`);
  const category = t(`projects.${id}.category`);
  const year = t(`projects.${id}.year`);
  const stack = t.raw(`projects.${id}.stack`) as string[];

  return (
    <article className="pb-[var(--section-y)] pt-[calc(var(--nav-height)+2rem)]">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE.outExpo }}
        >
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span>
            {tc("back")}
          </Link>

          <p className="mt-10 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            {category}
            <span className="mx-2 text-border-strong">·</span>
            {year}
          </p>

          <motion.h1
            layoutId={`project-title-${id}`}
            className="mt-4 max-w-[14ch] font-display text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-foreground"
          >
            {title}
          </motion.h1>

          <p className="mt-6 max-w-[36rem] text-base leading-relaxed text-muted sm:text-lg">
            {tc(`${id}.overview`)}
          </p>
        </motion.div>

        <div className="mt-10 sm:mt-12 md:mt-14">
          <ProjectMedia id={id} title={title} size="hero" priority />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 border-t border-border pt-12 md:mt-16 md:grid-cols-12 md:gap-10 md:pt-14">
          <aside className="md:col-span-4">
            <MetaBlock label={tc("role")} value={tc(`${id}.role`)} />
            <div className="mt-8">
              <p className="text-caption text-muted">{tc("stack")}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {Array.isArray(stack) &&
                  stack.map((item) => (
                    <li key={item}>
                      <span className="inline-flex rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] text-muted">
                        {item}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-12 md:col-span-8 md:space-y-14">
            <section>
              <h2 className="text-caption text-muted">{tc("problem")}</h2>
              <p className="mt-3 max-w-[38rem] text-[0.975rem] leading-[1.75] text-foreground/90">
                {tc(`${id}.problem`)}
              </p>
            </section>
            <section>
              <h2 className="text-caption text-muted">{tc("solution")}</h2>
              <p className="mt-3 max-w-[38rem] text-[0.975rem] leading-[1.75] text-foreground/90">
                {tc(`${id}.solution`)}
              </p>
            </section>
            <section>
              <h2 className="text-caption text-muted">{tc("outcome")}</h2>
              <p className="mt-3 max-w-[38rem] text-[0.975rem] leading-[1.75] text-muted">
                {tc(`${id}.outcome`)}
              </p>
            </section>

            <section>
              <h2 className="text-caption text-muted">{tc("gallery")}</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="aspect-[4/3] rounded-[1.25rem] border border-border bg-surface-1" />
                <div className="aspect-[4/3] rounded-[1.25rem] border border-border bg-surface-2" />
              </div>
              <p className="mt-4 max-w-[36rem] text-sm leading-relaxed text-muted">
                {tc("placeholderNote")}
              </p>
            </section>
          </div>
        </div>

        {/* Keep project href referenced for future deep links */}
        <span className="sr-only">{project.href}</span>
      </div>
    </article>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption text-muted">{label}</p>
      <p className="mt-2 text-sm text-foreground/90">{value}</p>
    </div>
  );
}
