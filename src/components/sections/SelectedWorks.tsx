"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { CaseStudyLink } from "@/components/work/CaseStudyLink";
import { PROJECTS, STACKED_ORDER, type ProjectId } from "@/lib/projects";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/**
 * Selected Works — secondary projects only (SparkXP is Featured).
 *
 * Premium editorial alternating layout (product-page rhythm):
 *   1 · text 35% | image 65%
 *   2 · image 65% | text 35%
 *   3 · text 35% | image 65%
 *
 * No sticky stack. Generous whitespace. Subtle scroll reveals only.
 */
export function SelectedWorks() {
  const t = useTranslations("work");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isReady || !rootRef.current) return;

    const root = rootRef.current;
    const rows = root.querySelectorAll<HTMLElement>("[data-project-row]");

    if (reduced) {
      rows.forEach((row) => {
        const parts = row.querySelectorAll<HTMLElement>("[data-project-part]");
        gsap.set(parts, { opacity: 1, y: 0, clearProps: "clipPath,scale" });
      });
      return;
    }

    const ctx = gsap.context(() => {
      rows.forEach((row) => {
        const textParts = row.querySelectorAll<HTMLElement>(
          "[data-project-text]",
        );
        const media = row.querySelector<HTMLElement>("[data-project-media]");

        // Text: soft stagger, fade + slight rise
        if (textParts.length) {
          gsap.fromTo(
            textParts,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 78%",
                once: true,
              },
            },
          );
        }

        // Image: opacity + transform only (clip-path was costly for little gain)
        if (media) {
          gsap.fromTo(
            media,
            {
              opacity: 0,
              y: 24,
              scale: 0.985,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.95,
              ease: "power3.out",
              scrollTrigger: {
                trigger: media,
                start: "top 82%",
                once: true,
              },
            },
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced]);

  return (
    <section
      id="work"
      ref={rootRef}
      className="relative scroll-mt-[var(--nav-height)] bg-background"
      aria-labelledby="work-heading"
    >
      <header className="container-page pb-12 pt-4 sm:pb-16 sm:pt-6 md:pb-20">
        <h2 id="work-heading" className="sr-only">
          {t("headline")}
        </h2>
        <p className="max-w-[28rem] text-[var(--text-body-sm)] leading-relaxed text-muted sm:text-base">
          {t("intro")}
        </p>
      </header>

      <div className="flex flex-col gap-24 sm:gap-28 md:gap-32 lg:gap-40">
        {STACKED_ORDER.map((id, index) => (
          <ProjectRow
            key={id}
            id={id}
            index={index}
            /** Even: text left; odd: image left */
            imageOnLeft={index % 2 === 1}
            reduced={reduced}
          />
        ))}
      </div>

      {/* Breathing room before Skills */}
      <div className="h-[var(--section-y)]" aria-hidden />
    </section>
  );
}

function ProjectRow({
  id,
  index,
  imageOnLeft,
  reduced,
}: {
  id: ProjectId;
  index: number;
  imageOnLeft: boolean;
  reduced: boolean;
}) {
  const t = useTranslations("work");
  const project = PROJECTS[id];
  const title = t(`projects.${id}.title`);
  const category = t(`projects.${id}.category`);
  const year = t(`projects.${id}.year`);
  const summary = t(`projects.${id}.summary`);
  const stack = t.raw(`projects.${id}.stack`) as string[];
  const number = String(index + 1).padStart(2, "0");

  const textCol = (
    <div
      className={cn(
        "flex flex-col justify-center",
        "lg:col-span-4",
        imageOnLeft ? "lg:order-2" : "lg:order-1",
        "order-2",
      )}
    >
      <p
        data-project-text
        data-project-part
        className={cn(
          "font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted",
          !reduced && "opacity-0",
        )}
      >
        <span className="text-foreground/45">{number}</span>
        <span className="mx-2 text-border-strong">·</span>
        {category}
        <span className="mx-2 text-border-strong">·</span>
        {year}
      </p>

      <motion.h3
        layoutId={`project-title-${id}`}
        id={`work-title-${id}`}
        data-project-text
        data-project-part
        className={cn(
          "mt-4 font-display text-[clamp(1.85rem,3.2vw,2.65rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-foreground",
          !reduced && "opacity-0",
        )}
      >
        <Link
          href={project.href}
          data-cursor="project"
          className="transition-colors duration-300 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {title}
        </Link>
      </motion.h3>

      <p
        data-project-text
        data-project-part
        className={cn(
          "mt-5 max-w-[26rem] text-[0.975rem] leading-[1.7] text-muted sm:text-base",
          !reduced && "opacity-0",
        )}
      >
        {summary}
      </p>

      {Array.isArray(stack) && (
        <ul
          data-project-text
          data-project-part
          className={cn("mt-7 flex flex-wrap gap-2", !reduced && "opacity-0")}
        >
          {stack.map((item) => (
            <li key={item}>
              <span className="inline-flex rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] tracking-wide text-muted">
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div
        data-project-text
        data-project-part
        className={cn("mt-8", !reduced && "opacity-0")}
      >
        <CaseStudyLink href={project.href} />
      </div>
    </div>
  );

  const imageCol = (
    <div
      className={cn(
        "lg:col-span-8",
        imageOnLeft ? "lg:order-1" : "lg:order-2",
        "order-1",
      )}
    >
      <div
        data-project-media
        data-project-part
        className={cn(!reduced && "opacity-0")}
      >
        <Link
          href={project.href}
          className="block"
          tabIndex={-1}
          aria-label={t("viewCaseStudy")}
          data-cursor="project"
        >
          <ProjectMedia id={id} title={title} size="hero" />
        </Link>
      </div>
    </div>
  );

  return (
    <article
      data-project-row
      className="container-page min-h-[min(75vh,48rem)]"
      aria-labelledby={`work-title-${id}`}
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        {textCol}
        {imageCol}
      </div>
    </article>
  );
}
