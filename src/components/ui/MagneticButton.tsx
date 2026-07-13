"use client";

import {
  useRef,
  type ReactNode,
  type MouseEvent,
  type RefObject,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
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
    "bg-accent text-[#0A0A0A] hover:brightness-[1.04] active:brightness-95",
  secondary:
    "bg-transparent text-foreground border border-border-strong hover:border-accent/40 hover:bg-surface-2/80",
  ghost: "bg-transparent text-foreground hover:text-accent",
};

function clamp(n: number, max: number) {
  return Math.max(-max, Math.min(max, n));
}

/**
 * Native OS cursor. Subtle magnetic pull (≤ ~5.5px) + soft lime edge on hover.
 * No custom cursor chrome.
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
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 26, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 320, damping: 26, mass: 0.35 });

  const magnetic = !reduced && canHover;

  const onMove = (e: MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    // Soft pull, hard-capped at MAGNET_MAX
    x.set(clamp(relX * 0.22, MAGNET_MAX));
    y.set(clamp(relY * 0.22, MAGNET_MAX));
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "relative inline-flex items-center justify-center gap-2",
    "rounded-full px-6 py-3",
    "text-sm font-medium tracking-tight",
    "transition-[filter,background-color,border-color,color,box-shadow] duration-300",
    "overflow-hidden select-none group",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent",
    // Very subtle lime edge on hover — not a glow bloom
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
      {/* Quiet lime wash — only primary, very low */}
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

  const motionStyle = magnetic ? { x: springX, y: springY } : undefined;

  if (href) {
    return (
      <motion.a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        className={classes}
        style={motionStyle}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      aria-label={ariaLabel}
      className={classes}
      style={motionStyle}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {content}
    </motion.button>
  );
}
