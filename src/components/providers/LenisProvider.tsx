"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll via Lenis, kept in sync with GSAP ScrollTrigger.
 * Single animation loop: gsap.ticker drives Lenis.raf.
 * Disabled entirely when prefers-reduced-motion is set.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      // Do not kill all ScrollTriggers here — reduced path still uses
      // once:true reveals with instant set(). Refresh only.
      ScrollTrigger.refresh();
      return;
    }

    // Coarser touch: shorter inertia so scrolling feels native-adjacent
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    const lenis = new Lenis({
      duration: finePointer ? 1.1 : 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices: lighter smoothing; avoid fighting native feel
      touchMultiplier: finePointer ? 1.2 : 1,
      syncTouch: !finePointer,
      syncTouchLerp: 0.075,
    });

    lenisRef.current = lenis;

    // One scroller proxy path: Lenis → ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    // Let layout settle, then refresh triggers
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, [reducedMotion]);

  return <>{children}</>;
}

/** Smooth-scroll to a hash target (works with or without Lenis). */
export function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -80 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
