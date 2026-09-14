"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ProjectId } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";
import { ProjectLinks } from "@/components/work/ProjectLinks";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { cn } from "@/lib/cn";

/** Shared project row used by the featured and secondary-work sections. */
export function ProjectEntry({
  id,
  index,
  featured = false,
}: {
  id: ProjectId;
  index: number;
  featured?: boolean;
}) {
  const t = useTranslations("work");
  const copyRoot = featured ? "featured" : `projects.${id}`;
  const title = t(`${copyRoot}.title`);
  const stack = t.raw(`${copyRoot}.stack`) as string[];
  const headingId = `work-title-${id}`;

  return (
    <article
      className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14"
      aria-labelledby={headingId}
    >
      <Link
        href={PROJECTS[id].href}
        className="block rounded-3xl"
        aria-label={`${title} — ${t("viewCaseStudy")}`}
      >
        <ProjectMedia id={id} size="card" />
      </Link>

      <div>
        <p className="text-caption text-muted">
          {!featured && (
            <span className="mr-3 text-accent">
              {String(index).padStart(2, "0")}
            </span>
          )}
          {t(`${copyRoot}.category`)}
          <span className="mx-2 text-border-strong">/</span>
          {t(`${copyRoot}.year`)}
        </p>
        <h2
          id={headingId}
          className={cn(
            "mt-4 font-display font-semibold tracking-[-0.04em]",
            featured
              ? "text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05]"
              : "text-[clamp(2rem,4vw,3.5rem)] leading-[1.12]",
          )}
        >
          <Link
            href={PROJECTS[id].href}
            className="transition-colors hover:text-accent"
          >
            {title}
          </Link>
        </h2>
        <p className="mt-5 max-w-lg text-base leading-[1.8] text-muted">
          {t(`${copyRoot}.summary`)}
        </p>
        <ul
          className="mt-6 flex flex-wrap gap-2"
          aria-label={t("stackLabel")}
        >
          {stack.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.6875rem] text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={PROJECTS[id].href}
          className={cn(
            "mt-8 inline-flex min-h-12 items-center gap-6 rounded-lg px-5 py-3 text-sm font-medium transition-colors",
            featured
              ? "bg-accent text-on-accent hover:bg-foreground"
              : "border border-border-strong hover:border-accent hover:text-accent",
          )}
        >
          {t("viewCaseStudy")}
          <span aria-hidden>↗</span>
        </Link>
        <ProjectLinks id={id} only={["live", "repo"]} className="mt-5" />
      </div>
    </article>
  );
}
