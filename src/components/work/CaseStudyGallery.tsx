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
            <button key={shot.src} type="button" aria-label={tg("open", { surface: caption })}
              onClick={(event) => { openerRef.current = event.currentTarget; setOpen(shot.index); }}
              className="group/shot overflow-hidden rounded-xl border border-border bg-surface-1 text-left transition-colors hover:border-border-strong">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                <Image src={shot.src} alt={`${alt} — ${caption}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 440px" className="object-contain" />
              </div>
              <div className="flex min-h-16 items-center justify-between gap-3 border-t border-border px-4 py-3">
                <div>
                  {shot.surface && <p className="mb-1 font-mono text-[0.5625rem] uppercase tracking-wider text-muted">{ts(shot.surface)}</p>}
                  <p className="text-sm font-medium">{caption}</p>
                </div>
                <span aria-hidden className="text-muted transition-colors group-hover/shot:text-accent">↗</span>
              </div>
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
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault(); onStep(event.key === "ArrowRight" ? 1 : -1);
        }
      }}>
      <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
        <p className="text-sm font-medium">{caption}</p>
        <button type="button" onClick={close} aria-label={tg("close")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-muted hover:text-foreground">✕</button>
      </header>
      <div className="relative h-[min(68dvh,48rem)]">
        <Image src={shown.src} alt={`${alt} — ${caption}`} fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-contain" loading="eager" />
      </div>
      <footer className="flex items-center justify-center gap-5 border-t border-border px-4 py-3">
        <button type="button" onClick={() => onStep(-1)} aria-label={tg("previous")} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border hover:text-accent">←</button>
        <span aria-live="polite" aria-atomic="true" className="min-w-16 text-center font-mono text-xs text-muted">{position} / {total}</span>
        <button type="button" onClick={() => onStep(1)} aria-label={tg("next")} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border hover:text-accent">→</button>
      </footer>
    </dialog>
  );
}
