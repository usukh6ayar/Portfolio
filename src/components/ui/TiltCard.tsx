"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * A frameless tilt stage. Only the supplied content is transformed: there is
 * no glare sheet, rim or background that can reveal the wrapper around an
 * image. Transform-only, written straight to the node — no state or re-render
 * per pointer move. Flat under reduced motion and on touch devices.
 */
export function TiltCard({
  children,
  className,
  /** Maximum tilt in degrees at the edges. */
  max = 8,
  /** How far the card rises toward the viewer while held. */
  lift = 14,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
}) {
  const card = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const rest = () => {
    rect.current = null;
    if (card.current) {
      card.current.style.transform =
        "rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
    }
  };

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    const r = (rect.current ??= event.currentTarget.getBoundingClientRect());
    const x = ((event.clientX - r.left) / r.width) * 2 - 1;
    const y = ((event.clientY - r.top) / r.height) * 2 - 1;

    if (card.current) {
      card.current.style.transform =
        `rotateY(${x * max}deg) rotateX(${-y * max}deg) ` +
        `translateZ(${lift}px) scale(1.02)`;
    }
  };

  return (
    // The stage owns the perspective and the pointer, so leaving the tilted
    // card never lands the pointer back on it and flickers.
    <div
      className={cn("relative [perspective:900px]", className)}
      onPointerEnter={(event) => {
        rect.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={track}
      onPointerLeave={rest}
      onPointerCancel={rest}
    >
      <div
        ref={card}
        className="relative h-full [transform-style:preserve-3d]"
        style={{
          transform: "rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
          transition: "transform 260ms cubic-bezier(0.16,1,0.3,1)",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
