"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useApp } from "@/components/providers/AppProviders";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

export type BridgeChapter =
  | "about"
  | "featured"
  | "work"
  | "skills"
  | "contact";

type SectionBridgeProps = {
  /** Next chapter being introduced */
  next: BridgeChapter;
  className?: string;
};

/**
 * Editorial handoff between chapters.
 * Softly previews the next section so the page reads as one story —
 * not independent blocks stacked with hard cuts.
 */
export function SectionBridge({ next, className }: SectionBridgeProps) {
  const t = useTranslations("transitions");
  const reduced = useReducedMotion();
  const { isReady } = useApp();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !rootRef.current) return;

    const root = rootRef.current;
    const line = root.querySelector<HTMLElement>("[data-bridge-line]");
    const label = root.querySelector<HTMLElement>("[data-bridge-label]");
    const title = root.querySelector<HTMLElement>("[data-bridge-title]");
    const glow = root.querySelector<HTMLElement>("[data-bridge-glow]");

    if (reduced) {
      gsap.set([line, label, title, glow].filter(Boolean), {
        opacity: 1,
        clearProps: "transform,scaleX",
      });
      if (line) gsap.set(line, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Timeline scrubbed across the bridge zone — calm handoff
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 92%",
          end: "center 48%",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
      });

      if (glow) {
        gsap.set(glow, { opacity: 0 });
        tl.to(glow, { opacity: 1, duration: 0.45, ease: "none" }, 0);
      }

      if (line) {
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        tl.to(line, { scaleX: 1, duration: 0.5, ease: "none" }, 0.05);
      }

      if (label) {
        gsap.set(label, { opacity: 0, y: 22 });
        tl.to(
          label,
          { opacity: 1, y: 0, duration: 0.45, ease: "none" },
          0.12,
        );
      }

      if (title) {
        gsap.set(title, { opacity: 0, y: 32 });
        tl.to(
          title,
          { opacity: 0.92, y: 0, duration: 0.55, ease: "none" },
          0.18,
        );
      }
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced, next]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative z-0 overflow-hidden",
        "py-14 sm:py-16 md:py-20",
        className,
      )}
      aria-hidden
    >
      {/* Soft light shift toward the next chapter */}
      <div
        data-bridge-glow
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] opacity-0"
        style={{
          background: `
            radial-gradient(
              ellipse 70% 80% at 50% 100%,
              color-mix(in srgb, var(--color-accent) 5.5%, transparent) 0%,
              transparent 68%
            )
          `,
        }}
      />

      <div className="container-page relative">
        <div
          data-bridge-line
          className="h-px w-full max-w-[8rem] origin-left bg-border-strong sm:max-w-[10rem]"
        />

        <p
          data-bridge-label
          className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted"
        >
          <span className="text-accent/80">{t("next")}</span>
          <span className="mx-2 text-border-strong">·</span>
          {t(`${next}.label`)}
        </p>

        <p
          data-bridge-title
          className="mt-3 max-w-[16ch] font-display text-[clamp(1.75rem,4.2vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground/90"
        >
          {t(`${next}.title`)}
        </p>
      </div>
    </div>
  );
}
