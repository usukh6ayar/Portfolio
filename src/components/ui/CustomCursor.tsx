"use client";

import { useEffect, useRef, useState } from "react";
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

/**
 * Custom cursor — transform-only, refs + GSAP quickTo.
 * Never re-renders on pointermove. Skips entirely on touch / reduced-motion.
 */
export function CustomCursor() {
  const t = useTranslations("cursor");
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const [mounted, setMounted] = useState(false);

  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const modeRef = useRef<CursorMode>("default");
  const visibleRef = useRef(false);
  const labelsRef = useRef({
    project: "",
    case: "",
    contact: "",
  });

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
    const core = coreRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    if (!enabled || !core || !ring || !label) {
      root.classList.remove("has-custom-cursor");
      root.style.removeProperty("cursor");
      body.style.removeProperty("cursor");
      return;
    }

    root.classList.add("has-custom-cursor");
    root.style.cursor = "none";
    body.style.cursor = "none";

    gsap.set([core, ring, label], {
      xPercent: -50,
      yPercent: -50,
      x: -100,
      y: -100,
      force3D: true,
    });
    // Label sits slightly past the pointer tip (matches prior +14 / +12 offset)
    gsap.set(label, { xPercent: 0, yPercent: 0 });

    const coreX = gsap.quickTo(core, "x", { duration: 0.05, ease: "power3" });
    const coreY = gsap.quickTo(core, "y", { duration: 0.05, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
    // Label lags with ring, offset from pointer
    const labelX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3" });
    const labelY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3" });

    const applyVisibility = (visible: boolean) => {
      if (visibleRef.current === visible) return;
      visibleRef.current = visible;
      const opacity = visible ? "1" : "0";
      core.style.opacity = opacity;
      // Ring/label visibility is mode-dependent
      applyMode(modeRef.current, true);
    };

    const applyMode = (mode: CursorMode, force = false) => {
      if (!force && modeRef.current === mode) return;
      modeRef.current = mode;

      const visible = visibleRef.current;
      const labeled =
        mode === "project" || mode === "case" || mode === "contact";
      const interactive = mode === "interactive";

      // Core size
      const coreSize = labeled || interactive ? "4px" : "6px";
      core.style.width = coreSize;
      core.style.height = coreSize;
      core.style.opacity = visible ? "1" : "0";

      // Ring vs label — never both
      if (labeled) {
        ring.style.opacity = "0";
        ring.style.width = "30px";
        ring.style.height = "30px";

        const text =
          mode === "project"
            ? labelsRef.current.project
            : mode === "case"
              ? labelsRef.current.case
              : labelsRef.current.contact;
        if (label.textContent !== text) label.textContent = text;
        label.style.opacity = visible ? "1" : "0";
        label.style.visibility = "visible";
      } else {
        label.style.opacity = "0";
        ring.style.opacity = visible ? "1" : "0";
        ring.style.width = interactive ? "44px" : "30px";
        ring.style.height = interactive ? "44px" : "30px";
        ring.style.borderColor = interactive
          ? "rgba(245,245,240,0.7)"
          : "rgba(245,245,240,0.4)";
      }
    };

    const onMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      coreX(x);
      coreY(y);
      ringX(x);
      ringY(y);
      labelX(x + 14);
      labelY(y + 12);
      applyVisibility(true);
      applyMode(resolveMode(e.target));
    };

    const onLeave = () => {
      applyVisibility(false);
      applyMode("default");
    };

    // One pointer listener — covers move + hover target via e.target
    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      root.style.removeProperty("cursor");
      body.style.removeProperty("cursor");
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([core, ring, label]);
      modeRef.current = "default";
      visibleRef.current = false;
    };
  }, [enabled]);

  if (!mounted || !enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden
      data-cursor-none
    >
      <div
        ref={ringRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 rounded-full border",
          "border-[rgba(245,245,240,0.4)]",
          "transition-[width,height,border-color,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        )}
        style={{
          width: 30,
          height: 30,
          opacity: 0,
          willChange: "transform",
        }}
      />

      <div
        ref={labelRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0",
          "inline-flex items-center rounded-full",
          "border border-[rgba(245,245,240,0.14)] bg-[#111111]/95",
          "px-2.5 py-1",
          "font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/90",
          "whitespace-nowrap",
          "transition-[opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        )}
        style={{
          opacity: 0,
          willChange: "transform",
        }}
      />

      <div
        ref={coreRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 rounded-full bg-accent",
          "transition-[width,height,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        )}
        style={{
          width: 6,
          height: 6,
          opacity: 0,
          willChange: "transform",
        }}
      />
    </div>
  );
}
