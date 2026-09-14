"use client";

import type { ProjectId } from "@/lib/projects";
import { ProjectShowcase } from "@/components/work/ProjectShowcase";
import { cn } from "@/lib/cn";

type ProjectMediaProps = {
  id: ProjectId;
  className?: string;
  size?: "hero" | "card";
  priority?: boolean;
};

/**
 * Project media. Both projects carry their own composition — whole screenshots
 * standing on the page, one per surface — so this is only the wrapper that
 * places it; a plate around them would put them back in a box.
 */
export function ProjectMedia({
  id,
  className,
  size = "card",
  priority = false,
}: ProjectMediaProps) {
  return (
    <div className={cn("w-full", className)}>
      <ProjectShowcase id={id} priority={priority} size={size} />
    </div>
  );
}
