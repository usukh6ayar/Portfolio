"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ProjectId } from "@/lib/projects";
import { cn } from "@/lib/cn";

/** The app plate a single phone is cut out of. */
const PHONE_SOURCE = {
  src: "/images/work/sparkxp-app-hero.webp",
  width: 1760,
  height: 990,
};
const PHONE = { key: "sparkxp-app-home", x: 680, y: 25, width: 402, height: 874 };

type Panel = {
  key: string;
  surface: string;
  src: string;
  className: string;
};

/**
 * Each project ships as several surfaces, and one screenshot only ever shows
 * one of them. Every surface stands on the page whole — no plate, no card, no
 * frame — separated from the background by a shadow and lifting under the
 * pointer. The labels underneath name the surfaces outright.
 */
const SHOWCASES: Record<
  ProjectId,
  { phone?: boolean; surfaces: readonly string[]; panels: readonly Panel[] }
> = {
  sparkxp: {
    phone: true,
    surfaces: ["app", "landing", "admin"],
    panels: [
      {
        key: "sparkxp-landing-hero",
        surface: "landing",
        src: "/images/work/sparkxp-landing-hero.webp",
        className: "left-0 top-[8%] w-[46%] -rotate-[1.5deg]",
      },
      {
        key: "sparkxp-admin-buddy",
        surface: "admin",
        src: "/images/work/sparkxp-admin-buddy.webp",
        className: "right-0 top-[26%] w-[46%] rotate-[1.5deg]",
      },
    ],
  },
  nomadkids: {
    surfaces: ["admin", "teacher", "parent"],
    panels: [
      {
        key: "nomadkids-esis",
        surface: "admin",
        src: "/images/work/nomadkids-esis.webp",
        className: "left-0 top-[4%] w-[44%] -rotate-[1.5deg]",
      },
      {
        key: "nomadkids-parent",
        surface: "parent",
        src: "/images/work/nomadkids-parent.webp",
        className: "right-0 top-[22%] w-[44%] rotate-[1.5deg]",
      },
      {
        key: "nomadkids-assessment",
        surface: "teacher",
        src: "/images/work/nomadkids-assessment.webp",
        className:
          "left-1/2 top-[16%] z-10 w-[52%] -translate-x-1/2 shadow-[0_40px_90px_-40px_rgba(0,0,0,1)]",
      },
    ],
  },
};

export function ProjectShowcase({
  id,
  priority,
  size,
}: {
  id: ProjectId;
  priority: boolean;
  size: "hero" | "card";
}) {
  const t = useTranslations("work.gallery.captions");
  const ts = useTranslations("work.surfaces");
  const showcase = SHOWCASES[id];

  const lift =
    "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:z-30 motion-safe:hover:scale-[1.04]";

  return (
    <div className="relative w-full">
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
        {showcase.panels.map((panel) => (
          <div key={panel.key} className={cn("absolute", lift, panel.className)}>
            <Image
              src={panel.src}
              alt={t(panel.key)}
              width={1200}
              height={900}
              priority={priority && !showcase.phone && panel.className.includes("z-10")}
              sizes={
                size === "hero"
                  ? "(max-width: 768px) 60vw, (max-width: 1280px) 46vw, 620px"
                  : "(max-width: 1024px) 60vw, 360px"
              }
              className="h-auto w-full rounded-lg shadow-[0_34px_80px_-40px_rgba(0,0,0,0.95)]"
            />
          </div>
        ))}

        {showcase.phone && (
          <div
            className={cn(
              "absolute inset-y-[4%] left-1/2 z-10 -translate-x-1/2",
              lift,
            )}
          >
            <div
              className="relative h-full overflow-hidden bg-black shadow-[0_30px_70px_-20px_rgba(0,0,0,0.95)]"
              style={{
                aspectRatio: `${PHONE.width} / ${PHONE.height}`,
                borderRadius: "15% / 7%",
              }}
            >
              <Image
                src={PHONE_SOURCE.src}
                alt={t(PHONE.key)}
                width={PHONE_SOURCE.width}
                height={PHONE_SOURCE.height}
                priority={priority}
                sizes={
                  size === "hero"
                    ? "(max-width: 1280px) 100vw, 1280px"
                    : "(max-width: 1024px) 100vw, 720px"
                }
                className="absolute !max-w-none"
                style={{
                  width: `${(PHONE_SOURCE.width / PHONE.width) * 100}%`,
                  height: `${(PHONE_SOURCE.height / PHONE.height) * 100}%`,
                  left: `${(-PHONE.x / PHONE.width) * 100}%`,
                  top: `${(-PHONE.y / PHONE.height) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
        {showcase.surfaces.map((surface) => (
          <li key={surface} className="flex items-center gap-2">
            <span aria-hidden className="h-1 w-1 rounded-full bg-accent/70" />
            {ts(surface)}
          </li>
        ))}
      </ul>
    </div>
  );
}
