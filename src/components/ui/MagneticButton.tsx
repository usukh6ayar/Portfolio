"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
  type MouseEvent,
  type RefObject,
} from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/** Hard cap — magnetic offset never exceeds this (px) */
const MAGNET_MAX = 5.5;

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

const variantClasses: Record<
  NonNullable<MagneticButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-accent text-on-accent hover:brightness-[1.04] active:brightness-95",
  secondary:
    "bg-transparent text-foreground border border-border-strong hover:border-accent/40 hover:bg-surface-2/80",
  ghost: "bg-transparent text-foreground hover:text-accent",
};

function clamp(n: number, max: number) {
  return Math.max(-max, Math.min(max, n));
}

/**
 * Native OS cursor + subtle magnetic pull.
 * Magnetic logic only initializes on fine-pointer + motion-OK devices.
 * Plain <a>/<button> avoids Framer SSR hydration mismatches.
 */
export function MagneticButton({
  children,
  className,
  variant = "primary",
  href,
  type = "button",
  onClick,
  target,
  rel,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafMove = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 26, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 320, damping: 26, mass: 0.35 });

  const magnetic = !reduced && canHover;

  useEffect(() => {
    const el = ref.current;
    if (!magnetic) {
      if (el) {
        el.style.transform = "";
        el.style.willChange = "";
      }
      return;
    }

    const apply = () => {
      const node = ref.current;
      if (!node) return;
      const sx = springX.get();
      const sy = springY.get();
      node.style.transform =
        sx === 0 && sy === 0 ? "" : `translate3d(${sx}px, ${sy}px, 0)`;
    };

    apply();
    const unsubX = springX.on("change", apply);
    const unsubY = springY.on("change", apply);
    return () => {
      unsubX();
      unsubY();
      if (el) {
        el.style.transform = "";
        el.style.willChange = "";
      }
      if (rafMove.current) cancelAnimationFrame(rafMove.current);
    };
  }, [magnetic, springX, springY]);

  const onEnter = () => {
    if (!magnetic || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
    ref.current.style.willChange = "transform";
  };

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    // Coalesce layout reads to one rAF
    if (rafMove.current) return;
    rafMove.current = requestAnimationFrame(() => {
      rafMove.current = 0;
      const rect = rectRef.current ?? ref.current?.getBoundingClientRect();
      if (!rect || !ref.current) return;
      rectRef.current = rect;
      const relX = clientX - rect.left - rect.width / 2;
      const relY = clientY - rect.top - rect.height / 2;
      x.set(clamp(relX * 0.22, MAGNET_MAX));
      y.set(clamp(relY * 0.22, MAGNET_MAX));
    });
  };

  const onLeave = () => {
    if (rafMove.current) {
      cancelAnimationFrame(rafMove.current);
      rafMove.current = 0;
    }
    rectRef.current = null;
    x.set(0);
    y.set(0);
    if (ref.current) ref.current.style.willChange = "";
  };

  const classes = cn(
    "relative inline-flex items-center justify-center gap-2",
    "rounded-full px-6 py-3",
    "text-sm font-medium tracking-tight",
    "transition-[filter,background-color,border-color,color,box-shadow] duration-300",
    "overflow-hidden select-none group",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent",
    variant === "primary" &&
      "hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-accent)_55%,transparent)]",
    variant === "secondary" &&
      "hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-accent)_28%,transparent)]",
    variantClasses[variant],
    className,
  );

  const content = (
    <>
      <span className="pointer-events-none absolute inset-0 rounded-full bg-white/[0.06] opacity-0 transition-opacity duration-300 group-active:opacity-100" />
      {variant === "primary" && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(184,243,0,0.12) 0%, transparent 70%)",
          }}
          aria-hidden
        />
      )}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={classes}
        onMouseEnter={magnetic ? onEnter : undefined}
        onMouseMove={magnetic ? onMove : undefined}
        onMouseLeave={magnetic ? onLeave : undefined}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      aria-label={ariaLabel}
      className={classes}
      onMouseEnter={magnetic ? onEnter : undefined}
      onMouseMove={magnetic ? onMove : undefined}
      onMouseLeave={magnetic ? onLeave : undefined}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
