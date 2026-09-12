"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GalleryImage } from "@/lib/projects";
import { cn } from "@/lib/cn";

type Surface = NonNullable<GalleryImage["surface"]> | "all";
const captionKey = (src: string) => src.split("/").pop()!.replace(/\.webp$/, "");

export function CaseStudyGallery({ images, alt }: { images: GalleryImage[]; alt: string }) {
  const ts = useTranslations("work.surfaces");
  const tg = useTranslations("work.gallery");
  const [surface, setSurface] = useState<Surface>("all");
  const [open, setOpen] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const surfaces = [...new Set(images.flatMap((image) => image.surface ? [image.surface] : []))];
  const shots = images.map((image, index) => ({ ...image, index }))
    .filter((image) => surface === "all" || image.surface === surface);

  const close = () => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="mt-6">
      {surfaces.length > 1 && (
        <div role="group" aria-label={tg("filter")} className="mb-6 flex flex-wrap gap-2">
          {(["all", ...surfaces] as Surface[]).map((value) => (
            <button key={value} type="button" aria-pressed={surface === value} onClick={() => setSurface(value)}
              className={cn("inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm transition-colors",
                surface === value ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:border-border-strong hover:text-foreground")}>
              {value === "all" ? tg("all") : ts(value)}
              <span className="font-mono text-[0.625rem] opacity-60">{value === "all" ? images.length : images.filter((image) => image.surface === value).length}</span>
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {shots.map((shot) => {
          const caption = tg(`captions.${captionKey(shot.src)}`);
          return (
            // No plate: these are device and browser mockups that carry their
            // own backdrop, and a card around them only adds empty margin.
            <button key={shot.src} type="button" aria-label={tg("open", { surface: caption })}
              onClick={(event) => { openerRef.current = event.currentTarget; setOpen(shot.index); }}
              className="group/shot block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-accent">
              {/* App shots are one phone on a wide plate: cropping to a tall
                  cell fills it with the device instead of its margins. */}
              <div className={cn("relative overflow-hidden rounded-lg shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)]",
                shot.surface === "app" ? "aspect-[9/14]" : "aspect-[4/3]")}>
                <Image src={shot.src} alt={`${alt} — ${caption}`} fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 440px"
                  className="object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/shot:scale-[1.03]" />
              </div>
              <p className="mt-3 flex items-baseline gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                {shot.surface && <span className="text-accent/70">{ts(shot.surface)}</span>}
                <span className="truncate text-muted">{caption}</span>
                <span aria-hidden className="ml-auto text-muted/60 transition-colors group-hover/shot:text-accent">↗</span>
              </p>
            </button>
          );
        })}
      </div>
      {open !== null && createPortal(
        <GalleryDialog images={images} index={open} alt={alt} onClose={close}
          onStep={(delta) => {
            const position = shots.findIndex((shot) => shot.index === open);
            setOpen(shots[(position + delta + shots.length) % shots.length].index);
          }}
          position={shots.findIndex((shot) => shot.index === open) + 1} total={shots.length} />,
        document.body,
      )}
    </div>
  );
}

/** Native modal semantics provide focus trapping and keep the background inert. */
function GalleryDialog({ images, index, alt, onClose, onStep, position, total }: {
  images: GalleryImage[]; index: number; alt: string; onClose: () => void;
  onStep: (delta: number) => void; position: number; total: number;
}) {
  const tg = useTranslations("work.gallery");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shown = images[index];
  const caption = tg(`captions.${captionKey(shown.src)}`);

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
          event.preventDefault(); onStep(event.key === "ArrowRight" ? 1 : -1);
        }
      }}>
      {/* Anywhere off the shot closes it — the controls stop the bubble. */}
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-8"
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        {/* Enlarged, an app plate is still mostly empty backdrop — the phone
            is cropped to fill the height instead. */}
        {shown.surface === "app" ? (
          <div className="gallery-shot relative aspect-[9/14] h-[min(78dvh,46rem)] max-w-[92vw] overflow-hidden rounded-xl shadow-[0_50px_120px_-40px_rgba(0,0,0,1)]">
            <Image src={shown.src} alt={`${alt} — ${caption}`} fill sizes="(max-width: 1280px) 60vw, 600px"
              loading="eager" className="object-cover object-center" />
          </div>
        ) : (
          <Image src={shown.src} alt={`${alt} — ${caption}`} width={1760} height={1320}
            sizes="(max-width: 1280px) 92vw, 1200px" loading="eager"
            className="gallery-shot h-auto max-h-[78dvh] w-auto max-w-[min(92vw,78rem)] rounded-xl object-contain shadow-[0_50px_120px_-40px_rgba(0,0,0,1)]" />
        )}
        <p className="flex items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
          <span className="text-foreground/80">{caption}</span>
          <span aria-live="polite" aria-atomic="true">{position} / {total}</span>
        </p>
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
