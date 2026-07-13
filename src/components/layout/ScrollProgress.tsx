"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Thin top scroll progress bar — lime accent, transform-only.
 */
export function ScrollProgress() {
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(0, { stiffness: 120, damping: 28, mass: 0.35 });

  useEffect(() => {
    if (!isReady) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(Math.max(scrollTop / max, 0), 1) : 0;
      setProgress(next);
      if (reduced) {
        scaleX.jump(next);
      } else {
        scaleX.set(next);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isReady, reduced, scaleX]);

  if (!isReady) return null;

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden
      data-progress={progress.toFixed(2)}
    />
  );
}
