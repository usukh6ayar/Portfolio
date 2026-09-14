"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ProjectId } from "@/lib/projects";
import { PhoneScreen } from "@/components/work/PhoneScreen";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/cn";

type Panel = {
  key: string;
  src: string;
  className: string;
  lead?: boolean;
};

/**
 * Each project ships as several surfaces, and one screenshot only ever shows
 * one of them. Every surface stands on the page whole — no plate, no card, no
 * frame — separated from the background by a shadow and lifting under the
 * pointer. The labels underneath name the surfaces outright.
 */
const SHOWCASES: Record<
  ProjectId,
  {
    /** A device screen standing in front of the web panels. */
    phone?: { key: string; src: string };
    surfaces: readonly string[];
    panels: readonly Panel[];
  }
> = {
  nomadkids: {
    surfaces: ["director", "teacher", "cook", "accountant", "parent"],
    panels: [
      {
        key: "nomadkids-director",
        src: "/images/work/nomadkids-director.webp",
        className: "left-0 top-[6%] w-[46%] -rotate-[1.5deg]",
      },
      {
        key: "nomadkids-cook",
        src: "/images/work/nomadkids-cook.webp",
        className: "right-0 top-[24%] w-[46%] rotate-[1.5deg]",
      },
      {
        key: "nomadkids-teacher",
        src: "/images/work/nomadkids-teacher.webp",
        className:
          "left-1/2 top-[16%] z-10 w-[54%] -translate-x-1/2 shadow-[0_40px_90px_-40px_rgba(0,0,0,1)]",
        lead: true,
      },
    ],
  },
  sparkxp: {
    phone: { key: "sparkxp-mobile-light", src: "/images/work/sparkxp-mobile-light.webp" },
    surfaces: ["app", "landing", "admin"],
    panels: [
      {
        key: "sparkxp-web-taniltsuulga",
        src: "/images/work/sparkxp-web-taniltsuulga.webp",
        className: "left-0 top-[10%] w-[48%] -rotate-[1.5deg]",
      },
      {
        key: "sparkxp-admin-buddy",
        src: "/images/work/sparkxp-admin-buddy.webp",
        className: "right-0 top-[26%] w-[48%] rotate-[1.5deg]",
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

  return (
    <div className="relative w-full">
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
        {showcase.panels.map((panel) => (
          // The exported WebP already contains transparent breathing room and
          // its own alpha shadow. Rear panels are dimmed so their white app
          // canvas reads as depth, not as a pale block beside the lead shot.
          <div
            key={panel.key}
            className={cn(
              "absolute hover:z-30",
              !panel.lead &&
                "opacity-70 brightness-[0.62] saturate-[0.72] transition-[filter,opacity] duration-300 hover:opacity-90 hover:brightness-[0.78]",
              panel.className,
            )}
          >
            <TiltCard max={7} lift={12}>
              <Image
                src={panel.src}
                alt={t(panel.key)}
                width={3200}
                height={2075}
                preload={priority && panel.lead}
                unoptimized
                sizes={
                  size === "hero"
                    ? "(max-width: 768px) 60vw, (max-width: 1280px) 48vw, 640px"
                    : "(max-width: 1024px) 60vw, 380px"
                }
                className="h-auto w-full"
              />
            </TiltCard>
          </div>
        ))}

        {showcase.phone && (
          <div className="absolute inset-y-[4%] left-1/2 z-10 flex -translate-x-1/2 justify-center hover:z-30">
            <TiltCard className="h-full" max={9} lift={14}>
              <PhoneScreen
                src={showcase.phone.src}
                alt={t(showcase.phone.key)}
                preload={priority}
                sizes={
                  size === "hero"
                    ? "(max-width: 1280px) 34vw, 360px"
                    : "(max-width: 1024px) 34vw, 220px"
                }
                className="h-full shadow-[0_30px_70px_-20px_rgba(0,0,0,0.95)]"
              />
            </TiltCard>
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
