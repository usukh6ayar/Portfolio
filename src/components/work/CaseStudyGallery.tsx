"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryImage } from "@/lib/projects";
import { PHONE_CROPS, PhoneCutout, cropKey } from "@/components/work/PhoneCutout";
import { cn } from "@/lib/cn";

type Surface = NonNullable<GalleryImage["surface"]> | "all";

/**
 * A grid of every screen, filtered by surface. Clicking one lifts it into a
 * lightbox that shows a single shot as large as the viewport allows, with
 * arrows and dot indicators to move through the set.
 *
 * Phone shots are cut out of their rendered plate rather than shown on it —
 * the device stands on the page with no box behind it.
 */
export function CaseStudyGallery({ images, alt }: { images: GalleryImage[]; alt: string }) {
  const ts = useTranslations("work.surfaces");
  const tg = useTranslations("work.gallery");
  const [surface, setSurface] = useState<Surface>("all");
  const [open, setOpen] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const surfaces = [...new Set(images.flatMap((image) => (image.surface ? [image.surface] : [])))];
  const shots = images
    .map((image, index) => ({ ...image, index }))
    .filter((image) => surface === "all" || image.surface === surface);
  const phones = shots.filter((shot) => PHONE_CROPS[cropKey(shot.src)]);
  const webs = shots.filter((shot) => !PHONE_CROPS[cropKey(shot.src)]);

  const close = () => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="mt-6">
      {surfaces.length > 1 && (
        <div role="group" aria-label={tg("filter")} className="mb-7 flex flex-wrap gap-2">
          {(["all", ...surfaces] as Surface[]).map((value) => (
            <button key={value} type="button" aria-pressed={surface === value}
              onClick={() => setSurface(value)}
              className={cn("inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm transition-colors",
                surface === value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-border-strong hover:text-foreground")}>
              {value === "all" ? tg("all") : ts(value)}
              <span className="font-mono text-[0.625rem] opacity-60">
                {value === "all" ? images.length : images.filter((image) => image.surface === value).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Devices are narrow, so four fit a row; browser shots are wide and get
          two, shown whole rather than cropped. */}
      {phones.length > 0 && (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
          {phones.map((shot) => {
            const key = cropKey(shot.src);
            const caption = tg(`captions.${key}`);
            return (
              <button key={shot.src} type="button" aria-label={tg("open", { surface: caption })}
                onClick={(event) => { openerRef.current = event.currentTarget; setOpen(shot.index); }}
                className="group/shot block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-accent">
                <div className="flex h-[clamp(13rem,22vw,19rem)] items-center justify-center">
                  <PhoneCutout src={shot.src} alt={`${alt} — ${caption}`} crop={PHONE_CROPS[key]}
                    sizes="(max-width: 640px) 45vw, 220px"
                    className="h-full shadow-[0_26px_50px_-28px_rgba(0,0,0,0.95)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/shot:scale-[1.05]" />
                </div>
                <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                  <span className="block truncate text-muted">{caption}</span>
                </p>
              </button>
            );
          })}
        </div>
      )}

      {webs.length > 0 && (
        <div className={cn("grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2", phones.length > 0 && "mt-10")}>
          {webs.map((shot) => {
            const caption = tg(`captions.${cropKey(shot.src)}`);
            return (
              <button key={shot.src} type="button" aria-label={tg("open", { surface: caption })}
                onClick={(event) => { openerRef.current = event.currentTarget; setOpen(shot.index); }}
                className="group/shot block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-accent">
                <Image src={shot.src} alt={`${alt} — ${caption}`} width={1200} height={900}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 480px"
                  className="h-auto w-full rounded-lg shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/shot:scale-[1.03]" />
                <p className="mt-4 flex items-baseline gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                  {shot.surface && <span className="text-accent/70">{ts(shot.surface)}</span>}
                  <span className="truncate text-muted">{caption}</span>
                  <span aria-hidden className="ml-auto text-muted/60 transition-colors group-hover/shot:text-accent">↗</span>
                </p>
              </button>
            );
          })}
        </div>
      )}

      {open !== null && createPortal(
        <GalleryDialog images={images} index={open} alt={alt} onClose={close}
          onStep={(delta) => {
            const position = shots.findIndex((shot) => shot.index === open);
            setOpen(shots[(position + delta + shots.length) % shots.length].index);
          }}
          onJump={(position) => setOpen(shots[position].index)}
          shots={shots}
          position={shots.findIndex((shot) => shot.index === open)} />,
        document.body,
      )}
    </div>
  );
}

/** Native modal semantics provide focus trapping and keep the background inert. */
function GalleryDialog({ images, index, alt, onClose, onStep, onJump, shots, position }: {
  images: GalleryImage[]; index: number; alt: string; onClose: () => void;
  onStep: (delta: number) => void; onJump: (position: number) => void;
  shots: (GalleryImage & { index: number })[]; position: number;
}) {
  const tg = useTranslations("work.gallery");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shown = images[index];
  const key = cropKey(shown.src);
  const caption = tg(`captions.${key}`);
  const crop = PHONE_CROPS[key];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, []);

  const close = () => {
    dialogRef.current?.close();
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="gallery-dialog" aria-label={caption} data-lenis-prevent
      onCancel={(event) => { event.preventDefault(); close(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          onStep(event.key === "ArrowRight" ? 1 : -1);
        }
      }}>
      {/* Anywhere off the shot closes it — the controls stop the bubble. */}
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-3 sm:p-6"
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        {crop ? (
          <PhoneCutout src={shown.src} alt={`${alt} — ${caption}`} crop={crop} priority
            sizes="(max-width: 1280px) 60vw, 640px"
            className="gallery-shot h-[min(84dvh,58rem)] max-w-[92vw] shadow-[0_50px_120px_-40px_rgba(0,0,0,1)]" />
        ) : (
          <Image src={shown.src} alt={`${alt} — ${caption}`} width={1760} height={1320}
            sizes="(max-width: 1280px) 94vw, 1400px" loading="eager"
            className="gallery-shot h-[min(88dvh,62rem)] w-auto max-w-[94vw] rounded-xl object-contain shadow-[0_50px_120px_-40px_rgba(0,0,0,1)]" />
        )}

        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-foreground/80">
            {caption}
          </p>
          {/* Dot indicators, as on the reference: the active one stretches. */}
          <div role="tablist" aria-label={tg("filter")} className="flex flex-wrap items-center justify-center gap-1.5">
            {shots.map((shot, i) => (
              <button key={shot.src} type="button" role="tab" aria-selected={i === position}
                aria-label={tg(`captions.${cropKey(shot.src)}`)}
                onClick={() => onJump(i)}
                className={cn("h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === position ? "w-7 bg-accent" : "w-1.5 bg-white/25 hover:bg-white/50")} />
            ))}
          </div>
        </div>
      </div>

      <button type="button" onClick={close} aria-label={tg("close")}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent sm:right-6 sm:top-6">✕</button>

      <button type="button" onClick={() => onStep(-1)} aria-label={tg("previous")}
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent sm:left-6">←</button>
      <button type="button" onClick={() => onStep(1)} aria-label={tg("next")}
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent sm:right-6">→</button>
    </dialog>
  );
}
