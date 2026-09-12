"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { ProjectLinks } from "@/components/work/ProjectLinks";
import { CaseStudyGallery } from "@/components/work/CaseStudyGallery";

import type { ProjectId } from "@/lib/projects";
import { FEATURED_ID, PROJECTS } from "@/lib/projects";
import { EASE } from "@/lib/easings";

/**
 * three + R3F is ~600 KB — keep it out of every other route's bundle and off
 * the server. Only the flagship case study mounts it.
 */
const BuddyAvatar = dynamic(
  () => import("@/components/work/BuddyAvatar").then((m) => m.BuddyAvatar),
  { ssr: false },
);

/** Reserve the canvas space, but defer the heavy 3D bundle until it is near. */
function LazyBuddyAvatar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || nearViewport) return;
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setNearViewport(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [nearViewport]);

  return (
    <div ref={rootRef} className="mt-4">
      {nearViewport ? (
        <BuddyAvatar />
      ) : (
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] border border-border bg-surface-1 sm:aspect-[16/10]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_12%,rgba(167,139,250,0.12),transparent_70%)]" />
        </div>
      )}
    </div>
  );
}

type CaseStudyViewProps = {
  id: ProjectId;
};

export function CaseStudyView({ id }: CaseStudyViewProps) {
  const t = useTranslations("work");
  const tc = useTranslations("work.caseStudy");
  const tb = useTranslations("work.buddy");
  const project = PROJECTS[id];
  const title = t(`projects.${id}.title`);
  const category = t(`projects.${id}.category`);
  const year = t(`projects.${id}.year`);
  const stack = t.raw(`projects.${id}.stack`) as string[];
  const highlights = tc.raw(`${id}.highlights`) as string[];
  /** Back to the section this project actually lives in */
  const backHref = id === FEATURED_ID ? "/#featured" : "/#work";

  return (
    <article className="pb-[var(--section-y)] pt-[calc(var(--nav-height)+2rem)]">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE.outExpo }}
        >
          <Link
            href={backHref}
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

          <ProjectLinks id={id} className="mt-7" />
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

            {id === FEATURED_ID && (
              <section>
                <h2 className="text-caption text-muted">{tb("label")}</h2>
                <LazyBuddyAvatar />
                <p className="mt-4 max-w-[36rem] text-sm leading-relaxed text-muted">
                  {tb("note")}
                </p>
              </section>
            )}

            <section>
              <h2 className="text-caption text-muted">{tc("highlights")}</h2>
              <ul className="mt-4 max-w-[38rem] space-y-3">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[0.975rem] leading-[1.75] text-foreground/90"
                  >
                    <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-border-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-caption text-muted">{tc("gallery")}</h2>
              {project.gallery?.length ? (
                <CaseStudyGallery
                  images={project.gallery}
                  alt={t("imageAlt", { title })}
                />
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="aspect-[4/3] rounded-[1.25rem] border border-border bg-surface-1" />
                  <div className="aspect-[4/3] rounded-[1.25rem] border border-border bg-surface-2" />
                </div>
              )}
              <p className="mt-4 max-w-[36rem] text-sm leading-relaxed text-muted">
                {project.gallery?.length ? tc("galleryNote") : tc("placeholderNote")}
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
