"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Where the device sits inside each app plate, measured off the pixels rather
 * than eyeballed. Cropping to it and masking the corners lifts the phone off
 * its rendered backdrop, so it stands on the page instead of in a purple box.
 */
export type PhoneCrop = {
  plate: [number, number];
  device: [number, number, number, number];
};

export const PHONE_CROPS: Record<string, PhoneCrop> = {
  "sparkxp-app-hero": { plate: [1760, 990], device: [680, 25, 402, 874] },
  "sparkxp-app-lessons": { plate: [1200, 900], device: [412, 43, 377, 814] },
  "sparkxp-app-review": { plate: [1200, 900], device: [412, 43, 377, 814] },
  "sparkxp-app-buddychat": { plate: [1200, 900], device: [412, 43, 377, 814] },
  "sparkxp-app-quiz": { plate: [1200, 900], device: [412, 43, 377, 814] },
};

export function cropKey(src: string) {
  return src.split("/").pop()!.replace(/\.webp$/, "");
}

export function PhoneCutout({
  src,
  alt,
  crop,
  sizes,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  crop: PhoneCrop;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [pw, ph] = crop.plate;
  const [x, y, w, h] = crop.device;

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        aspectRatio: `${w} / ${h}`,
        // Matches the device's own corner radius, so the plate that survives
        // the rectangular crop is cut away with it.
        borderRadius: "14% / 6.5%",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={pw}
        height={ph}
        sizes={sizes}
        priority={priority}
        className="absolute !max-w-none"
        style={{
          width: `${(pw / w) * 100}%`,
          height: `${(ph / h) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
        }}
      />
    </div>
  );
}
