"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Precise dot with a quiet magnetic outline around compact controls. */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const enabled = finePointer && !reduced;

  useEffect(() => {
    const dot = dotRef.current;
    const outline = outlineRef.current;
    if (!enabled || !dot || !outline) return;
    const root = document.documentElement;
    let pointer: { x: number; y: number } | null = null;
    let scrollFrame = 0;
    let magnetFrame = 0;
    let magnet: Element | null = null;
    let radius = 8;

    const clearMagnet = () => {
      magnet = null;
      window.cancelAnimationFrame(magnetFrame);
      magnetFrame = 0;
      outline.style.opacity = "0";
      dot.dataset.magnetic = "false";
    };
    const drawOutline = () => {
      if (!magnet || !pointer) return;
      if (!magnet.isConnected) {
        clearMagnet();
        return;
      }
      const rect = magnet.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // The frame is attracted to the control, with just a little pointer pull.
      const pullX = Math.max(-3, Math.min(3, (pointer.x - cx) * 0.08));
      const pullY = Math.max(-3, Math.min(3, (pointer.y - cy) * 0.08));
      outline.style.transform = `translate3d(${cx + pullX}px, ${cy + pullY}px, 0) translate(-50%, -50%)`;
      outline.style.width = `${rect.width + 12}px`;
      outline.style.height = `${rect.height + 12}px`;
      outline.style.borderRadius = `${Math.min(radius + 6, (rect.height + 12) / 2)}px`;
      outline.style.opacity = "1";
    };
    // Existing magnetic buttons move on springs; follow their actual bounds.
    // No animation loop runs while the pointer is outside a compact control.
    const followMagnet = () => {
      magnetFrame = 0;
      drawOutline();
      if (magnet) magnetFrame = window.requestAnimationFrame(followMagnet);
    };

    const hide = () => {
      clearMagnet();
      dot.style.opacity = "0";
      root.classList.remove("has-custom-cursor");
    };
    const leave = () => {
      pointer = null;
      hide();
    };
    const updateTarget = (target: Element | null) => {
      if (!target || target.closest('input, textarea, select, [contenteditable="true"], dialog, [data-cursor-none]')) {
        hide();
        return;
      }
      const interactive = target.closest('a, button, summary, [role="button"]');
      const active = interactive && !interactive.matches(':disabled, [aria-disabled="true"]');
      dot.dataset.interactive = active ? "true" : "false";
      const rect = active ? interactive.getBoundingClientRect() : null;
      const compact = rect && rect.width >= 12 && rect.height >= 12 && rect.width <= 320 && rect.height <= 88;
      if (compact && interactive) {
        if (magnet !== interactive) {
          magnet = interactive;
          radius = parseFloat(window.getComputedStyle(interactive).borderTopLeftRadius) || 0;
        }
        dot.dataset.magnetic = "true";
        drawOutline();
        if (!magnetFrame) magnetFrame = window.requestAnimationFrame(followMagnet);
      } else {
        clearMagnet();
      }
      dot.style.opacity = "1";
      root.classList.add("has-custom-cursor");
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        leave();
        return;
      }
      pointer = { x: event.clientX, y: event.clientY };
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      updateTarget(event.target instanceof Element ? event.target : null);
    };
    // The page moves under a stationary pointer. Keep the dot in place and
    // refresh its hover state once per frame, including nested scroll areas.
    const scroll = () => {
      if (!pointer || scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        if (pointer) updateTarget(document.elementFromPoint(pointer.x, pointer.y));
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", leave);
    window.addEventListener("keydown", leave);
    window.addEventListener("scroll", scroll, { passive: true, capture: true });
    window.addEventListener("resize", scroll, { passive: true });
    root.addEventListener("pointerleave", leave);
    return () => {
      leave();
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", leave);
      window.removeEventListener("keydown", leave);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", scroll);
      root.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled || typeof document === "undefined") return null;
  return createPortal(
    <>
      <div ref={outlineRef} className="cursor-outline" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden><span /></div>
    </>,
    document.body,
  );
}
