"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

/** Device captures are raw screens — 1179×2556, no bezel drawn into them. */
export const PHONE_RATIO = 1179 / 2556;

export function isPhoneShot(src: string) {
  return /-mobile-/.test(src);
}

/** The filename is the caption key: `/images/work/x.webp` → `x`. */
export function shotKey(src: string) {
  return src.split("/").pop()!.replace(/\.webp$/, "");
}

/**
 * A phone screen standing on the page. The capture has no device frame, so the
 * only thing added is the corner radius a phone actually has — no bezel, no
 * plate, nothing between the screen and the background.
 */
export function PhoneScreen({
  src,
  alt,
  sizes,
  preload = false,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: `${PHONE_RATIO}`, borderRadius: "11% / 5%" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        // Served exactly as it sits in public/images/work — no second encode.
        unoptimized
        className="object-cover"
      />
    </div>
  );
}
