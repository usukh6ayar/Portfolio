"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ProjectId } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";
import { HoverFollowLabel } from "@/components/ui/HoverFollowLabel";
import { cn } from "@/lib/cn";

const TONE: Record<(typeof PROJECTS)[ProjectId]["tone"], string> = {
  lime: "rgba(184, 243, 0, 0.055)",
  violet: "rgba(167, 139, 250, 0.06)",
  cool: "rgba(120, 170, 220, 0.055)",
  warm: "rgba(220, 160, 100, 0.055)",
  neutral: "rgba(245, 245, 240, 0.035)",
};

type ProjectMediaProps = {
  id: ProjectId;
  title: string;
  className?: string;
  size?: "hero" | "card";
  priority?: boolean;
  /** Cursor pill on hover — Preview / Open. Empty string disables. */
  cursorLabel?: string | false;
};

/**
 * Product screenshot surface. Native cursor + optional lagging pill label.
 * Image uses opacity/scale only on hover — no distortion.
 */
export function ProjectMedia({
  id,
  title,
  className,
  size = "card",
  priority = false,
  cursorLabel,
}: ProjectMediaProps) {
  const t = useTranslations("work");
  const tCursor = useTranslations("cursor");
  const project = PROJECTS[id];
  const alt = t("imageAlt", { title });
  const tint = TONE[project.tone];
  const label =
    cursorLabel === false
      ? null
      : cursorLabel ?? (project.image ? tCursor("open") : tCursor("preview"));

  const figure = (
    <motion.figure
      layoutId={`project-media-${id}`}
      className={cn(
        "group/media relative w-full overflow-hidden",
        "rounded-[1.5rem] border border-border bg-surface-1",
        "shadow-[0_24px_64px_-40px_rgba(0,0,0,0.65)]",
        "transition-[border-color] duration-300",
        "hover:border-border-strong",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full",
          size === "hero"
            ? "aspect-[16/10] lg:aspect-[16/9]"
            : "aspect-[16/10] sm:aspect-[5/3]",
        )}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={alt}
            fill
            sizes={
              size === "hero"
                ? "(max-width: 1024px) 100vw, 90vw"
                : "(max-width: 1024px) 100vw, 70vw"
            }
            priority={priority}
            className={cn(
              "object-cover object-top",
              "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "opacity-[0.96] motion-safe:group-hover/media:scale-[1.01] motion-safe:group-hover/media:opacity-100",
            )}
          />
        ) : (
          <Placeholder title={title} tint={tint} />
        )}
      </div>
      <figcaption className="sr-only">{alt}</figcaption>
    </motion.figure>
  );

  if (!label) return figure;

  return (
    <HoverFollowLabel label={label} className="block w-full">
      {figure}
    </HoverFollowLabel>
  );
}

function Placeholder({ title, tint }: { title: string; tint: string }) {
  const t = useTranslations("work");

  return (
    <div
      className="absolute inset-0 flex flex-col transition-opacity duration-500 group-hover/media:opacity-[0.98]"
      style={{ background: "#121212" }}
      role="img"
      aria-label={t("imagePlaceholder")}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${tint} 0%, transparent 72%)`,
        }}
        aria-hidden
      />

      <div className="relative flex h-full flex-col p-5 sm:p-7 md:p-8">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/28">
              {title}
            </span>
          </div>
          <div className="hidden gap-3 sm:flex">
            <span className="h-1.5 w-12 rounded-full bg-white/[0.06]" />
            <span className="h-1.5 w-8 rounded-full bg-white/[0.05]" />
          </div>
        </div>

        <div className="mt-6 grid flex-1 grid-cols-12 gap-3 sm:gap-4">
          <div className="col-span-3 flex flex-col gap-2">
            <div className="h-2 w-4/5 rounded-full bg-white/[0.07]" />
            <div className="h-2 w-full rounded-full bg-white/[0.04]" />
            <div className="h-2 w-3/4 rounded-full bg-white/[0.04]" />
            <div className="mt-4 h-2 w-2/3 rounded-full bg-white/[0.04]" />
            <div className="h-2 w-5/6 rounded-full bg-white/[0.035]" />
          </div>
          <div className="col-span-9 flex flex-col gap-3">
            <div className="h-7 w-1/3 rounded-lg bg-white/[0.06]" />
            <div className="grid flex-1 grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.03]" />
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.045]" />
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.03]" />
            </div>
            <div className="h-2 w-full rounded-full bg-white/[0.04]" />
            <div className="h-2 w-3/4 rounded-full bg-white/[0.03]" />
          </div>
        </div>

        <p className="mt-auto pt-4 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/18">
          {t("imagePlaceholder")}
        </p>
      </div>
    </div>
  );
}
