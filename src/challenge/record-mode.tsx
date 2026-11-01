"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Record mode — clean, repeatable screen recordings for reels.
 *
 *   /challenge/<slug>?record=1          auto-scroll top → bottom in 18 s
 *   /challenge/<slug>?record=1&dur=24   …in 24 s
 *   &delay=2.5                          wait longer before scrolling
 *
 * Hides the cursor and the site overlay, starts at the top, waits, then
 * scrolls with an ease-in-out and holds at the bottom. Sites read
 * `useRecordMode()` to fire their own clicks or drive a virtual cursor, so
 * the whole experience plays with no hands on the mouse.
 */

export type RecordState = {
  active: boolean;
  /** Seconds the scroll takes */
  duration: number;
  /** Seconds before the scroll starts */
  delay: number;
  /** True once the auto-scroll has begun; sites can key timed events off it */
  started: boolean;
};

const OFF: RecordState = { active: false, duration: 18, delay: 1.5, started: false };

const RecordContext = createContext<RecordState>(OFF);

export function useRecordMode(): RecordState {
  return useContext(RecordContext);
}

// The query never changes during a visit; read it once and keep the object
// stable so useSyncExternalStore does not loop.
let cached: { search: string; state: RecordState } | null = null;

function readParams(): RecordState {
  const search = window.location.search;
  if (cached && cached.search === search) return cached.state;
  cached = { search, state: parse(search) };
  return cached.state;
}

const subscribe = () => () => {};
const serverSnapshot = () => OFF;

function parse(search: string): RecordState {
  const q = new URLSearchParams(search);
  if (q.get("record") !== "1") return OFF;
  const num = (key: string, fallback: number) => {
    const v = Number(q.get(key));
    return Number.isFinite(v) && v > 0 ? v : fallback;
  };
  return {
    active: true,
    duration: num("dur", OFF.duration),
    delay: num("delay", OFF.delay),
    started: false,
  };
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function RecordModeProvider({ children }: { children: ReactNode }) {
  // Read from location rather than useSearchParams so the page stays
  // statically rendered; the server snapshot is always "off".
  const params = useSyncExternalStore(subscribe, readParams, serverSnapshot);
  const [started, setStarted] = useState(false);
  const ran = useRef(false);
  const { active, duration, delay } = params;

  useEffect(() => {
    if (!active || ran.current) return;

    const root = document.documentElement;
    root.classList.add("record-mode");
    window.scrollTo(0, 0);

    let raf = 0;
    let poll = 0;

    const run = () => {
      ran.current = true;
      ScrollTrigger.refresh();
      setStarted(true);

      const max = root.scrollHeight - window.innerHeight;
      const lenis = (window as Window & { __lenis?: Lenis }).__lenis;

      if (lenis) {
        lenis.scrollTo(max, {
          duration,
          easing: easeInOutCubic,
          lock: true,
          force: true,
        });
        return;
      }

      // Reduced motion disables Lenis; tween the native scroll instead.
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000));
        window.scrollTo(0, max * easeInOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // The site chunk loads after the shell, so wait until the page is
    // actually taller than the screen (up to 10 s) before measuring.
    const timer = window.setTimeout(() => {
      const until = performance.now() + 10_000;
      const check = () => {
        const tall = root.scrollHeight > window.innerHeight + 40;
        if (tall || performance.now() > until) run();
        else poll = window.setTimeout(check, 100);
      };
      check();
    }, delay * 1000);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(poll);
      cancelAnimationFrame(raf);
    };
  }, [active, duration, delay]);

  useEffect(() => {
    return () => document.documentElement.classList.remove("record-mode");
  }, []);

  const value = useMemo(() => ({ ...params, started }), [params, started]);

  return (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
  );
}
