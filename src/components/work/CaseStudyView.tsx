"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { ProjectLinks } from "@/components/work/ProjectLinks";
import { CaseStudyGallery } from "@/components/work/CaseStudyGallery";

import type { ProjectId } from "@/lib/projects";
import { ALL_PROJECT_IDS, FEATURED_ID, PROJECTS } from "@/lib/projects";

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
    // Capped: at full container width the canvas would tower over the copy.
    <div ref={rootRef} className="mt-5">
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

  const nextId = ALL_PROJECT_IDS[(ALL_PROJECT_IDS.indexOf(id) + 1) % ALL_PROJECT_IDS.length];
  const sections = ["overview", "gallery", "highlights"] as const;

  return (
    <article className="pb-16 pt-[calc(var(--nav-height)+2rem)] sm:pb-24">
      <div className="container-page !max-w-[80rem]">
        <Link href={backHref} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
          <span aria-hidden>←</span>{tc("back")}
        </Link>

        <header className="grid gap-8 pb-10 pt-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16 lg:pb-12 lg:pt-12">
          <div>
            <p className="text-caption text-muted">{category}<span className="mx-3 text-border-strong">/</span>{year}</p>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,6.5vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.045em]">{title}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{t(`projects.${id}.summary`)}</p>
          </div>
          <div className="lg:pb-1">
            <p className="text-caption text-muted">{tc("role")}</p>
            <p className="mt-2 text-sm leading-relaxed">{tc(`${id}.role`)}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={tc("stack")}>
              {stack.map((item) => <li key={item} className="rounded-md border border-border bg-surface-1 px-2.5 py-1 font-mono text-[0.6875rem] text-muted">{item}</li>)}
            </ul>
            <ProjectLinks id={id} className="mt-6" />
          </div>
        </header>

        <ProjectMedia id={id} title={title} size="hero" priority showAction={false} />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-14">
          <aside>
            <nav aria-label={tc("contents")} className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-5 lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:flex-col lg:gap-1 lg:border-b-0 lg:border-l lg:pb-0 lg:pl-5">
              {sections.map((section, index) => (
                <a key={section} href={`#${section}`} className="flex min-h-11 items-center gap-3 text-sm text-muted transition-colors hover:text-accent">
                  <span className="font-mono text-[0.625rem] text-muted/60">0{index + 1}</span>{tc(section)}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-16 sm:space-y-20">
            <section id="overview" className="case-section" aria-labelledby="overview-title">
              <SectionTitle number="01" title={tc("overview")} id="overview-title" />
              <p className="mt-6 max-w-[65ch] text-base leading-[1.85] text-muted">{tc(`${id}.overview`)}</p>
              <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-surface-1 px-5 sm:px-7">
                {(["problem", "solution", "outcome"] as const).map((key) => (
                  <div key={key} className="grid gap-3 py-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6">
                    <h3 className={`text-sm font-medium ${key === "outcome" ? "text-accent" : "text-foreground"}`}>{tc(key)}</h3>
                    <p className="text-sm leading-[1.85] text-muted">{tc(`${id}.${key}`)}</p>
                  </div>
                ))}
              </div>
            </section>

            {project.gallery?.length ? (
              <section id="gallery" className="case-section" aria-labelledby="gallery-title">
                <SectionTitle number="02" title={tc("gallery")} id="gallery-title" />
                <p className="mt-3 text-sm leading-relaxed text-muted">{tc("galleryNote")}</p>
                <CaseStudyGallery images={project.gallery} alt={t("imageAlt", { title })} />
              </section>
            ) : null}

            <section id="highlights" className="case-section" aria-labelledby="highlights-title">
              <SectionTitle number="03" title={tc("highlights")} id="highlights-title" />
              <ul className="mt-6 divide-y divide-border">
                {highlights.map((item, index) => (
                  <li key={item} className="flex gap-5 py-5 first:pt-0">
                    <span aria-hidden className="pt-1 font-mono text-[0.625rem] text-accent/70">{String(index + 1).padStart(2, "0")}</span>
                    <p className="max-w-[65ch] text-sm leading-[1.85] text-muted">{item}</p>
                  </li>
                ))}
              </ul>
              {id === FEATURED_ID && (
                <div className="mt-8 border-t border-border pt-8">
                  <h3 className="font-display text-xl font-medium">{tb("label")}</h3>
                  <LazyBuddyAvatar />
                  <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted">{tb("note")}</p>
                </div>
              )}
            </section>
          </div>
        </div>

        <footer className="mt-16 border-t border-border pt-8 sm:mt-24">
          <Link href={PROJECTS[nextId].href} className="group flex items-center justify-between gap-6 rounded-xl p-4 transition-colors hover:bg-surface-1 sm:p-6">
            <div>
              <p className="text-caption text-muted">{tc("nextProject")}</p>
              <p className="mt-3 font-display text-2xl font-medium tracking-tight sm:text-4xl">{t(`projects.${nextId}.title`)}</p>
            </div>
            <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong transition-colors group-hover:border-accent group-hover:text-accent">↗</span>
          </Link>
        </footer>
      </div>
    </article>
  );
}

function SectionTitle({ number, title, id }: { number: string; title: string; id: string }) {
  return <div className="flex items-baseline gap-4"><span aria-hidden className="font-mono text-xs text-accent">{number}</span><h2 id={id} className="font-display text-2xl font-medium tracking-tight sm:text-3xl">{title}</h2></div>;
}
