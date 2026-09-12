"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { GalleryImage } from "@/lib/projects";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/easings";
import { cn } from "@/lib/cn";

type Shot = GalleryImage & { index: number };
type Group = { surface?: GalleryImage["surface"]; shots: Shot[] };

/**
 * Runs of the same surface stay together in source order — the registry
 * already lists shots grouped, and consecutive runs keep the page honest if
 * a surface ever appears twice.
 */
function groupBySurface(images: GalleryImage[]): Group[] {
  const groups: Group[] = [];
  images.forEach((img, index) => {
    const last = groups[groups.length - 1];
    if (last && last.surface === img.surface) {
      last.shots.push({ ...img, index });
    } else {
      groups.push({ surface: img.surface, shots: [{ ...img, index }] });
    }
  });
  return groups;
}

/**
 * Case-study gallery — grouped by product surface, the first shot of each
 * group running full width and the rest paired in an offset two-column grid.
 * Clicking a shot lifts it into a lightbox through a shared-element
 * transition; arrows and Escape drive it from the keyboard.
 */
export function CaseStudyGallery({
  images,
  alt,
}: {
  images: GalleryImage[];
  alt: string;
}) {
  const ts = useTranslations("work.surfaces");
  const tg = useTranslations("work.gallery");
  const reduced = useReducedMotion();

  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<number | null>(null);

  const groups = groupBySurface(images);
  const shown = open === null ? null : images[open];

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) =>
        i === null ? i : (i + delta + images.length) % images.length,
      ),
    [images.length],
  );

  // Escape and arrows while the lightbox owns the screen.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  // Freeze the page underneath, the same way the command palette does.
  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (
      window as Window & {
        __lenis?: { stop: () => void; start: () => void };
      }
    ).__lenis;
    lenis?.stop();
    const focus = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
      window.clearTimeout(focus);
    };
  }, [open]);

  // Hand focus back to the thumbnail that opened the lightbox.
  useEffect(() => {
    if (open !== null) {
      restoreTo.current = open;
      return;
    }
    const i = restoreTo.current;
    if (i === null) return;
    restoreTo.current = null;
    triggers.current[i]?.focus();
  }, [open]);

  const layout = (src: string) => (reduced ? undefined : `shot-${src}`);

  return (
    <>
      <div className="mt-5 space-y-10">
        {groups.map((group) => (
          <div key={`${group.surface ?? "all"}-${group.shots[0].index}`}>
            {group.surface && (
              <p className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                {ts(group.surface)}
                <span aria-hidden className="h-px flex-1 bg-border" />
              </p>
            )}

            <div
              className={cn(
                "grid grid-cols-1 items-start gap-4 sm:grid-cols-2",
                group.surface && "mt-4",
              )}
            >
              {group.shots.map((shot, i) => {
                // Phone shots are one device on a wide backdrop — stretching
                // one across the column just buys empty space. Surfaces that
                // are actually wide (landing, admin, a site screenshot) lead
                // with a full-width plate.
                const lead = group.surface !== "app" && i === 0;
                const column = group.surface !== "app" ? (i - 1) % 2 : i % 2;
                return (
                <button
                  key={shot.src}
                  ref={(el) => {
                    triggers.current[shot.index] = el;
                  }}
                  type="button"
                  onClick={() => setOpen(shot.index)}
                  aria-label={tg("open", {
                    surface: group.surface ? ts(group.surface) : alt,
                  })}
                  className={cn(
                    "group/shot relative block w-full overflow-hidden rounded-[1.25rem]",
                    "border border-border bg-surface-1 text-left",
                    "transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "hover:border-border-strong motion-safe:hover:-translate-y-0.5",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent",
                    lead && "sm:col-span-2",
                    // The right-hand column of each pair sits a little lower.
                    !lead && column === 1 && "sm:mt-8",
                  )}
                >
                  <div
                    className={cn(
                      "relative w-full",
                      lead ? "aspect-[16/10]" : "aspect-[4/3]",
                    )}
                  >
                    {open !== shot.index && (
                      <motion.div
                        layoutId={layout(shot.src)}
                        className="absolute inset-0"
                      >
                        <Image
                          src={shot.src}
                          alt={alt}
                          fill
                          sizes={
                            lead
                              ? "(max-width: 640px) 100vw, 760px"
                              : "(max-width: 640px) 100vw, 380px"
                          }
                          style={{
                            objectPosition:
                              shot.position ?? (lead ? "top" : "center"),
                          }}
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </div>
                </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {shown && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: EASE.outExpo }}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={close}
          >
            {/* Keyed: without a remount, arrowing to the next shot would swap
                the layoutId on a live node and framer would collapse the panel
                into that shot's thumbnail. Remounting makes every step its own
                shared-element flight out of the grid. */}
            <motion.div
              key={shown.src}
              layoutId={layout(shown.src)}
              className="relative max-h-full w-full max-w-5xl overflow-hidden rounded-[1.25rem] border border-border-strong bg-surface-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={shown.src}
                  alt={alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            <div
              className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2 sm:bottom-7"
              onClick={(e) => e.stopPropagation()}
            >
              <LightboxButton onClick={() => step(-1)} label={tg("previous")}>
                ←
              </LightboxButton>
              <span className="min-w-16 text-center font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                {(open ?? 0) + 1} / {images.length}
              </span>
              <LightboxButton onClick={() => step(1)} label={tg("next")}>
                →
              </LightboxButton>
            </div>

            <LightboxButton
              ref={closeRef}
              onClick={close}
              label={tg("close")}
              className="absolute right-4 top-4 sm:right-6 sm:top-6"
            >
              ✕
            </LightboxButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LightboxButton({
  ref,
  onClick,
  label,
  className,
  children,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  onClick: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border border-border-strong bg-black/70 text-foreground backdrop-blur-md",
        "transition-colors duration-200 hover:border-accent/40 hover:text-accent",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent",
        className,
      )}
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}
