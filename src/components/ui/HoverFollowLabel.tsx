"use client";

import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

type HoverFollowLabelProps = {
  children: ReactNode;
  /** Pill text, e.g. "View Project →" */
  label: string;
  className?: string;
  /** Disable follow (e.g. when nested interactive has its own label) */
  disabled?: boolean;
};

/**
 * Native cursor stays. On fine-pointer hover, a small lagging pill
 * tracks the pointer inside the field. Invisible when idle.
 * Disabled entirely under prefers-reduced-motion.
 */
export function HoverFollowLabel({
  children,
  label,
  className,
  disabled = false,
}: HoverFollowLabelProps) {
  const reduced = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = !reduced && canHover && !disabled;

  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Slight lag — premium, not sticky
  const springX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.45 });

  const onEnter = useCallback(() => {
    if (!enabled) return;
    setActive(true);
  }, [enabled]);

  const onLeave = useCallback(() => {
    setActive(false);
  }, []);

  const onMove = useCallback(
    (e: ReactMouseEvent) => {
      if (!enabled || !rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      // Offset so the pill sits just past the native cursor tip
      x.set(e.clientX - rect.left + 14);
      y.set(e.clientY - rect.top + 14);
    },
    [enabled, x, y],
  );

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    >
      {children}

      <AnimatePresence>
        {enabled && active && (
          <motion.span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-30",
              "inline-flex items-center gap-1.5",
              "rounded-full border border-border-strong bg-surface-1/95",
              "px-2.5 py-1",
              "font-mono text-[0.625rem] uppercase tracking-[0.12em] text-foreground/90",
              "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]",
              "whitespace-nowrap",
            )}
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
