"use client";

import { useTranslations } from "next-intl";
import type { ProjectId, ProjectLinkKind } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";
import { cn } from "@/lib/cn";

type ProjectLinksProps = {
  id: ProjectId;
  /** Narrow to a subset — cards show only the live product */
  only?: ProjectLinkKind[];
  className?: string;
};

/**
 * Outbound links to the running product and its source, straight from the
 * registry. Renders nothing when a project has none, so a project without a
 * public URL simply shows no row.
 */
export function ProjectLinks({ id, only, className }: ProjectLinksProps) {
  const t = useTranslations("work.links");
  const all = PROJECTS[id].links ?? [];
  const links = only ? all.filter((link) => only.includes(link.kind)) : all;

  if (!links.length) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group/link inline-flex items-center gap-1.5",
              "text-sm font-medium tracking-tight text-foreground",
              "transition-colors duration-300 hover:text-accent",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
            )}
          >
            <span className="link-underline">{t(link.kind)}</span>
            <span
              aria-hidden
              className="text-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:-translate-y-[2px] group-hover/link:translate-x-[2px]"
            >
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
