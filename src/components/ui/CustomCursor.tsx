"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

type CursorMode = "default" | "interactive" | "project" | "case" | "contact";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "input",
  "textarea",
  "select",
  "label",
  "summary",
  "[data-cursor]",
  "[data-cursor-interactive]",
].join(",");

/** Controls compact enough for the blob to wrap without looking like a slab. */
const MAGNETIC_SELECTOR = "[data-magnetic], button, [role='button'], a";
const MAGNET_MAX_W = 280;
const MAGNET_MAX_H = 96;
/** How far toward the element's centre the blob is pulled once it locks. */
const MAGNETIC_FACTOR = 0.85;

/** Ring diameter while free, and while over a target it cannot wrap. */
const BLOB = 40;
const BLOB_OPEN = 56;

const PARTICLES = 12;

function resolveMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return "default";
  if (target.closest("[data-cursor-none]")) return "default";

  const labeled = target.closest("[data-cursor]");
  if (labeled instanceof Element) {
    const kind = labeled.getAttribute("data-cursor");
    if (kind === "project") return "project";
    if (kind === "case") return "case";
    if (kind === "contact") return "contact";
    if (kind === "interactive") return "interactive";
  }

  const el = target.closest(INTERACTIVE_SELECTOR);
  if (!el) return "default";

  if (
    el instanceof HTMLButtonElement ||
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  ) {
    if (el.disabled) return "default";
  }
  if (el.getAttribute("aria-disabled") === "true") return "default";

  return "interactive";
}

/** The control under the pointer, before it is measured. */
function resolveMagnet(target: EventTarget | null): Element | null {
  if (!(target instanceof Element)) return null;
  if (target.closest("[data-cursor-none]")) return null;
  return target.closest(MAGNETIC_SELECTOR);
}

/** Slabs and hairlines are left alone; only compact controls get wrapped. */
function wrappable(rect: DOMRect) {
  return (
    rect.width <= MAGNET_MAX_W &&
    rect.height <= MAGNET_MAX_H &&
    rect.width >= 8 &&
    rect.height >= 8
  );
}

/**
 * Custom cursor — a magnetic ring and a dot, nothing else.
 *
 * The ring runs on a spring rather than a tween: it carries velocity, so it
 * stretches along its own direction of travel and settles with a little
 * overshoot. Over a compact control it is pulled toward the element's centre
 * and morphs to its outline, which is what makes buttons feel like they
 * attract the pointer. `difference` blending keeps it legible over anything it
 * crosses without tinting the page.
 *
 * Portalled to <body> on purpose: `mix-blend-mode` only reaches the page when
 * nothing between the element and the root isolates it into its own stacking
 * context. Transform-only, refs + GSAP. Never re-renders on pointermove.
 * Skips entirely on touch / reduced-motion.
 */
export function CustomCursor() {
  const t = useTranslations("cursor");
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const [mounted, setMounted] = useState(false);

  const blobRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const modeRef = useRef<CursorMode>("default");
  const visibleRef = useRef(false);
  const labelsRef = useRef({ project: "", case: "", contact: "" });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    labelsRef.current = {
      project: t("view"),
      case: t("openCase"),
      contact: t("sayHi"),
    };
  }, [t]);

  const enabled = mounted && finePointer && !reduced;

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const blob = blobRef.current;
    const core = coreRef.current;
    const label = labelRef.current;
    const particles = particleRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!enabled || !blob || !core || !label) {
      root.classList.remove("has-custom-cursor");
      root.style.removeProperty("cursor");
      body.style.removeProperty("cursor");
      return;
    }

    root.classList.add("has-custom-cursor");
    root.style.cursor = "none";
    body.style.cursor = "none";

    gsap.set(core, {
      xPercent: -50,
      yPercent: -50,
      x: -400,
      y: -400,
      force3D: true,
    });
    gsap.set(label, { xPercent: 0, yPercent: 0, x: -400, y: -400, force3D: true });
    gsap.set(particles, { xPercent: -50, yPercent: -50, opacity: 0 });

    const coreX = gsap.quickTo(core, "x", { duration: 0.045, ease: "power3" });
    const coreY = gsap.quickTo(core, "y", { duration: 0.045, ease: "power3" });
    const labelX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3" });
    const labelY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3" });

    let labelWidth = 0;
    let pressed = false;

    // — Blob spring state. Position and velocity in px; the velocity is what
    //   drives the stretch, so it is integrated rather than tweened.
    const pointer = { x: -400, y: -400 };
    const pos = { x: -400, y: -400 };
    const vel = { x: 0, y: 0 };
    let magnet: Element | null = null;
    let magnetRect: DOMRect | null = null;
    // The candidate is tracked separately so a control the blob declined to
    // wrap is not re-measured on every single pointermove.
    let candidate: Element | null = null;

    /** Free ring size — a touch wider over a target too big to wrap. */
    const openSize = () =>
      modeRef.current === "default" ? BLOB : BLOB_OPEN;

    const resize = (w: number, h: number, radius: number, ease: string) =>
      gsap.to(blob, {
        width: w,
        height: h,
        borderRadius: radius,
        duration: 0.45,
        ease,
        overwrite: "auto",
      });

    /** Grow the blob to the control's outline, or shrink back to a ring. */
    const applyMagnet = (next: Element | null) => {
      if (next === candidate) return;
      candidate = next;

      const rect = next ? next.getBoundingClientRect() : null;
      const accepted = rect && wrappable(rect) ? next : null;
      if (accepted === magnet) return;

      magnet = accepted;
      magnetRect = accepted ? rect : null;

      if (accepted && magnetRect) {
        const radius = parseFloat(
          getComputedStyle(accepted).borderRadius || "9999",
        );
        resize(
          magnetRect.width + 12,
          magnetRect.height + 12,
          Math.min(radius + 6, (magnetRect.height + 12) / 2),
          "power3.out",
        );
      } else {
        const s = openSize();
        resize(s, s, s / 2, "elastic.out(1, 0.7)");
      }
    };

    const applyMode = (mode: CursorMode, force = false) => {
      if (!force && modeRef.current === mode) return;
      const previous = modeRef.current;
      modeRef.current = mode;

      const visible = visibleRef.current;
      const labeled =
        mode === "project" || mode === "case" || mode === "contact";

      core.style.width = labeled ? "4px" : "6px";
      core.style.height = labeled ? "4px" : "6px";
      core.style.opacity = visible ? "1" : "0";
      blob.style.opacity = visible ? "1" : "0";

      if (labeled) {
        const text =
          mode === "project"
            ? labelsRef.current.project
            : mode === "case"
              ? labelsRef.current.case
              : labelsRef.current.contact;
        if (label.textContent !== text) {
          label.textContent = text;
          // Measured once per label change — never inside pointermove.
          labelWidth = label.offsetWidth;
        }
        label.style.opacity = visible ? "1" : "0";
      } else {
        label.style.opacity = "0";
      }

      // Only the free ring answers to the mode; a wrapped control owns its size.
      if (!magnet && mode !== previous) {
        const s = openSize();
        resize(s, s, s / 2, "power3.out");
      }
    };

    const applyVisibility = (visible: boolean) => {
      if (visibleRef.current === visible) return;
      visibleRef.current = visible;
      applyMode(modeRef.current, true);
    };

    // — The spring. Runs on GSAP's ticker so it shares the page's one rAF.
    const tick = (_time: number, deltaMs: number) => {
      // Clamped so a stalled tab does not fire the blob across the screen.
      const step = Math.min(deltaMs, 40) / 16.667;

      let tx = pointer.x;
      let ty = pointer.y;
      if (magnet && magnetRect) {
        const cx = magnetRect.left + magnetRect.width / 2;
        const cy = magnetRect.top + magnetRect.height / 2;
        tx += (cx - tx) * MAGNETIC_FACTOR;
        ty += (cy - ty) * MAGNETIC_FACTOR;
      }

      vel.x = (vel.x + (tx - pos.x) * 0.22 * step) * 0.76;
      vel.y = (vel.y + (ty - pos.y) * 0.22 * step) * 0.76;
      pos.x += vel.x * step;
      pos.y += vel.y * step;

      const speed = Math.hypot(vel.x, vel.y);
      // Gooey stretch along the direction of travel — dropped while locked, so
      // a wrapped control keeps its shape.
      const stretch = magnet ? 0 : Math.min(speed / 46, 0.42);
      // Only a stretched blob has a direction worth rotating to; a wrapped
      // control must stay square to the element it is tracing.
      const angle = stretch > 0.01 ? Math.atan2(vel.y, vel.x) : 0;
      const press = pressed ? 0.88 : 1;

      blob.style.transform =
        `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) ` +
        `rotate(${angle}rad) ` +
        `scale(${(1 + stretch) * press}, ${(1 - stretch * 0.72) * press})`;
    };
    gsap.ticker.add(tick);

    const burst = (x: number, y: number) => {
      for (const [i, p] of particles.entries()) {
        const a = (i / particles.length) * Math.PI * 2 + Math.random() * 0.5;
        const d = 40 + Math.random() * 58;
        gsap.set(p, { x, y, opacity: 1, scale: 0.7 + Math.random() * 0.6 });
        gsap.to(p, {
          x: x + Math.cos(a) * d,
          y: y + Math.sin(a) * d,
          scale: 0.25,
          duration: 0.5 + Math.random() * 0.25,
          ease: "power3.out",
          overwrite: true,
        });
        // Held bright through the first of the flight, then dropped — without
        // a glow to carry them, fading from frame one makes them invisible.
        gsap.to(p, {
          opacity: 0,
          duration: 0.4,
          delay: 0.14,
          ease: "power2.in",
          overwrite: false,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      pointer.x = x;
      pointer.y = y;
      coreX(x);
      coreY(y);
      // Flip the label to the other side near the viewport edge.
      const flip = x + labelWidth + 32 > window.innerWidth;
      labelX(flip ? x - labelWidth - 16 : x + 16);
      labelY(y + 14);

      applyVisibility(true);
      applyMode(resolveMode(e.target));
      applyMagnet(resolveMagnet(e.target));
    };

    const onLeave = () => {
      applyVisibility(false);
      applyMode("default");
      applyMagnet(null);
    };

    const onDown = (e: PointerEvent) => {
      pressed = true;
      burst(e.clientX, e.clientY);
    };
    const onUp = () => {
      pressed = false;
    };
    // A locked control moves with the page; re-measure instead of trailing it.
    const remeasure = () => {
      if (magnet) magnetRect = magnet.getBoundingClientRect();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    window.addEventListener("blur", onLeave);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      root.style.removeProperty("cursor");
      body.style.removeProperty("cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("blur", onLeave);
      root.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
      gsap.killTweensOf([blob, core, label, ...particles]);
      modeRef.current = "default";
      visibleRef.current = false;
    };
  }, [enabled]);

  if (!enabled) return null;

  // No wrapping element: a positioned wrapper would isolate the blend into its
  // own stacking context and it would stop reaching the page.
  return createPortal(
    <>
      <div
        ref={blobRef}
        aria-hidden
        data-cursor-none
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          width: BLOB,
          height: BLOB,
          borderRadius: BLOB / 2,
          opacity: 0,
          border: "1.5px solid rgba(245,245,240,0.9)",
          background: "rgba(245,245,240,0.05)",
          mixBlendMode: "difference",
          transition: "opacity 220ms var(--ease-out-expo)",
          willChange: "transform, width, height",
        }}
      />

      {Array.from({ length: PARTICLES }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            particleRefs.current[i] = el;
          }}
          aria-hidden
          data-cursor-none
          className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-accent"
          style={{
            width: 5,
            height: 5,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
      ))}

      <div
        ref={labelRef}
        aria-hidden
        data-cursor-none
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9999]",
          "inline-flex items-center rounded-full",
          "border border-border-strong bg-[#0a0a0a]/92",
          "px-2.5 py-1",
          "font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-accent",
          "whitespace-nowrap",
          "transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        )}
        style={{ opacity: 0, willChange: "transform, opacity" }}
      />

      <div
        ref={coreRef}
        aria-hidden
        data-cursor-none
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-accent",
          "transition-[width,height,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        )}
        style={{
          width: 6,
          height: 6,
          opacity: 0,
          // A hairline, not a glow: it keeps the dot readable on light
          // screenshots without lighting up the page around it.
          boxShadow: "0 0 0 1.5px rgba(10,10,10,0.45)",
          willChange: "transform, opacity",
        }}
      />
    </>,
    document.body,
  );
}
