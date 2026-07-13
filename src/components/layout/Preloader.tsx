"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/easings";

const SESSION_KEY = "portfolio-preloader-seen";

/**
 * Theatrical counter only once per browser session.
 * Return visits and case-study navigation skip the show.
 */
export function Preloader() {
  const t = useTranslations("common");
  const { isReady, setReady } = useApp();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }

    // Instant path: already seen this session, or reduced motion
    if (seen || reduced) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      const timer = window.setTimeout(() => {
        if (countRef.current) countRef.current.textContent = "100";
        setVisible(false);
        setReady();
      }, 0);
      return () => window.clearTimeout(timer);
    }

    document.documentElement.style.overflow = "hidden";

    const counter = { value: 0 };
    let lastShown = -1;
    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
        window.setTimeout(() => {
          setVisible(false);
          setReady();
          document.documentElement.style.overflow = "";
        }, 180);
      },
    });

    // Update counter via DOM — avoid React re-render every tick
    tl.to(counter, {
      value: 100,
      duration: 1.35,
      ease: "power2.inOut",
      onUpdate: () => {
        const n = Math.round(counter.value);
        if (n === lastShown) return;
        lastShown = n;
        if (countRef.current) {
          countRef.current.textContent = String(n).padStart(3, "0");
        }
      },
    });

    if (barRef.current) {
      tl.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.35, ease: "power2.inOut" },
        0,
      );
    }

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, [reduced, setReady]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: EASE.outExpo },
          }}
          aria-hidden={isReady}
          role="status"
          aria-live="polite"
          aria-label={t("loading")}
        >
          <div className="flex w-full max-w-[12rem] flex-col items-center gap-6 px-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
              {t("name")}
            </p>

            <div className="flex w-full items-end justify-between gap-4">
              <span
                ref={countRef}
                className="font-mono text-4xl font-medium tabular-nums tracking-tight text-foreground"
              >
                000
              </span>
              <span className="mb-1 font-mono text-xs text-muted">%</span>
            </div>

            <div
              className="h-px w-full origin-left overflow-hidden bg-border-strong"
              aria-hidden
            >
              <div
                ref={barRef}
                className="h-full w-full origin-left scale-x-0 bg-accent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
