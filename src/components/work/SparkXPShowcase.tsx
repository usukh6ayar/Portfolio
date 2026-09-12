"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

// Reuse the original screenshots without repainting their UI. Each viewport
// isolates one phone from the source plate; CSS owns spacing and hierarchy.
const SOURCE = { src: "/images/work/sparkxp-app-hero.webp", width: 1760, height: 990 };
const PHONES = [
  { key: "sparkxp-app-lessons", x: 216, y: 60, width: 404, height: 874, primary: false },
  { key: "sparkxp-app-home", x: 680, y: 25, width: 402, height: 874, primary: true },
  { key: "sparkxp-app-review", x: 1142, y: 60, width: 404, height: 874, primary: false },
] as const;

export function SparkXPShowcase({ priority, size }: { priority: boolean; size: "hero" | "card" }) {
  const t = useTranslations("work.gallery.captions");

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#100f15]">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_85%_at_50%_35%,rgba(139,112,201,0.18),transparent_80%)]" />
      <div className="absolute inset-x-[8%] inset-y-[9%] flex items-center justify-center gap-[5%]">
        {PHONES.map((phone) => (
          <div key={phone.key}
            className={cn(
              "relative shrink-0 overflow-hidden bg-black shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10",
              phone.primary ? "z-10 h-full" : "h-[86%]",
            )}
            style={{ aspectRatio: `${phone.width} / ${phone.height}`, borderRadius: "15% / 7%" }}>
            <Image
              src={SOURCE.src}
              alt={t(phone.key)}
              width={SOURCE.width}
              height={SOURCE.height}
              preload={priority && phone.primary}
              sizes={size === "hero" ? "(max-width: 1280px) 100vw, 1280px" : "(max-width: 1024px) 100vw, 720px"}
              className="absolute !max-w-none"
              style={{
                width: `${SOURCE.width / phone.width * 100}%`,
                height: `${SOURCE.height / phone.height * 100}%`,
                left: `${-phone.x / phone.width * 100}%`,
                top: `${-phone.y / phone.height * 100}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
