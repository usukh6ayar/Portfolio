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
  const [cursor, setCursor] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const surfaces = [...new Set(images.flatMap((image) => image.surface ? [image.surface] : []))];
  const shots = images.map((image, index) => ({ ...image, index }))
    .filter((image) => surface === "all" || image.surface === surface);
  const active = shots[Math.min(cursor, shots.length - 1)];
  const activeCaption = tg(`captions.${captionKey(active.src)}`);
  const step = (delta: number) =>
    setCursor((i) => (i + delta + shots.length) % shots.length);

  const close = () => {
    setOpen(null);
    openerRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="mt-6">
      {surfaces.length > 1 && (
        <div role="group" aria-label={tg("filter")} className="mb-6 flex flex-wrap gap-2">
          {(["all", ...surfaces] as Surface[]).map((value) => (
            <button key={value} type="button" aria-pressed={surface === value} onClick={() => { setSurface(value); setCursor(0); }}
              className={cn("inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm transition-colors",
                surface === value ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:border-border-strong hover:text-foreground")}>
              {value === "all" ? tg("all") : ts(value)}
              <span className="font-mono text-[0.625rem] opacity-60">{value === "all" ? images.length : images.filter((image) => image.surface === value).length}</span>
            </button>
          ))}
        </div>
      )}
      {/* One shot at a time, large: a grid of small thumbnails made the phone
          screens unreadable and the dashboards worse. Text sits beside it, the
          dots below carry the position, and clicking lifts it into the
          lightbox. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12">
        <div className="order-2 flex flex-col justify-center lg:order-1">
          {active.surface && (
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent/80">
              {ts(active.surface)}
            </p>
          )}
          <p className="mt-2 font-display text-xl font-medium tracking-[-0.02em]">
            {activeCaption}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button type="button" onClick={() => step(-1)} aria-label={tg("previous")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent">←</button>
            <button type="button" onClick={() => step(1)} aria-label={tg("next")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent">→</button>
            <span aria-live="polite" aria-atomic="true" className="ml-1 font-mono text-[0.6875rem] text-muted">
              {cursor + 1} / {shots.length}
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <button type="button" ref={openerRef}
            aria-label={tg("open", { surface: activeCaption })}
            onClick={() => setOpen(active.index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
              if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
            }}
            className="group/shot flex h-[clamp(18rem,52vh,34rem)] w-full items-center justify-center lg:justify-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-accent">
            {/* App shots are one phone on a wide plate: a tall crop fills the
                frame with the device instead of its margins. */}
            <div className={cn(
              "relative h-full overflow-hidden rounded-xl shadow-[0_34px_80px_-40px_rgba(0,0,0,0.95)]",
              "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/shot:scale-[1.02]",
              active.surface === "app" ? "aspect-[9/14]" : "aspect-[4/3]",
            )}>
              <Image key={active.src} src={active.src} alt={`${alt} — ${activeCaption}`} fill priority
                sizes="(max-width: 1024px) 92vw, 760px"
                className="object-cover object-center motion-safe:animate-[gallery-fade_420ms_cubic-bezier(0.16,1,0.3,1)]" />
            </div>
          </button>

          <div role="tablist" aria-label={tg("filter")} className="mt-5 flex flex-wrap items-center justify-center gap-1.5 lg:justify-start">
            {shots.map((shot, i) => (
              <button key={shot.src} type="button" role="tab" aria-selected={i === cursor}
                aria-label={tg(`captions.${captionKey(shot.src)}`)}
                onClick={() => setCursor(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === cursor ? "w-7 bg-accent" : "w-1.5 bg-border-strong hover:bg-muted",
                )} />
            ))}
          </div>
        </div>
      </div>
      {open !== null && createPortal(
        <GalleryDialog images={images} index={open} alt={alt} onClose={close}
          onStep={(delta) => {
            const position = shots.findIndex((shot) => shot.index === open);
            const next = (position + delta + shots.length) % shots.length;
            setCursor(next);
            setOpen(shots[next].index);
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
