"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True while the element is on screen (plus a margin). Used to stop render
 * loops that have nothing to show once they have scrolled away.
 * Assumes visible where IntersectionObserver is unavailable.
 */
export function useInView(
  ref: RefObject<Element | null>,
  rootMargin = "0px",
): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
