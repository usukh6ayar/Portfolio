"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Thin top scroll progress bar — lime accent, transform-only.
 * No React state on scroll; updates scaleX via DOM.
 */
export function ScrollProgress() {
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!isReady) return;
    const bar = barRef.current;
    if (!bar) return;

    const readProgress = () => {
      const scrollTop = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(Math.max(scrollTop / max, 0), 1) : 0;
    };

    const paint = (value: number) => {
      bar.style.transform = `scaleX(${value})`;
    };

    const tick = () => {
      rafRef.current = 0;
      const target = targetRef.current;
      if (reduced) {
        currentRef.current = target;
        paint(target);
        return;
      }
      // Light lerp — smooth without Framer spring overhead
      const cur = currentRef.current;
      const next = cur + (target - cur) * 0.18;
      currentRef.current = Math.abs(target - next) < 0.001 ? target : next;
      paint(currentRef.current);
      if (currentRef.current !== target) {
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      targetRef.current = readProgress();
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      targetRef.current = readProgress();
      if (reduced) {
        currentRef.current = targetRef.current;
        paint(targetRef.current);
      } else if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    targetRef.current = readProgress();
    currentRef.current = targetRef.current;
    paint(currentRef.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, reduced]);

  if (!isReady) return null;

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      style={{ transform: "scaleX(0)" }}
      aria-hidden
    />
  );
}
