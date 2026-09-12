"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * A card lit from wherever the pointer is.
 *
 * The tilt alone never reads as three-dimensional — a rotated flat image still
 * looks flat. What sells it is light: a specular sheen that slides across the
 * surface, a rim that brightens on the edge facing the pointer, a contact
 * shadow on the page that swings the other way, and the content floating a
 * little above the card plane so it parallaxes against its own frame.
 *
 * Transform-only, written straight to the nodes — no state, no re-render per
 * move. Flat under reduced motion; a touch device simply never hovers.
 */
export function TiltCard({
  children,
  className,
  /** Maximum tilt in degrees at the edges. */
  max = 8,
  /** How far the card rises toward the viewer while held. */
  lift = 14,
  /** A rectangular sheen and rim — cut-out devices pass false. */
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  glare?: boolean;
}) {
  const card = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
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
      card.current.style.boxShadow = "none";
    }
    if (sheen.current) sheen.current.style.opacity = "0";
    if (shadow.current) {
      shadow.current.style.opacity = "0.35";
      shadow.current.style.transform = "translate3d(0, 0, 0) scale(0.92)";
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
      // Rim light on the edge the pointer is over, as a light above it would.
      card.current.style.boxShadow = glare
        ? `inset ${-x * 10}px ${-y * 10}px 44px -22px rgba(255,255,255,0.26)`
        : "none";
    }
    if (sheen.current) {
      sheen.current.style.opacity = "1";
      // Wide and low-contrast, then blurred by the layer itself: a hard-edged
      // disc reads as a white ball rather than light on a surface.
      sheen.current.style.background =
        `radial-gradient(58% 78% at ${((x + 1) / 2) * 100}% ${((y + 1) / 2) * 100}%, ` +
        `rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.07) 38%, transparent 76%)`;
    }
    if (shadow.current) {
      // The cast shadow moves opposite the tilt and spreads as the card rises.
      shadow.current.style.opacity = "0.6";
      shadow.current.style.transform =
        `translate3d(${-x * 26}px, ${-y * 12 + 14}px, 0) scale(1.02)`;
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
        ref={shadow}
        aria-hidden
        className="pointer-events-none absolute inset-x-[6%] bottom-[2%] top-[16%] rounded-[40%] bg-black blur-2xl"
        style={{
          opacity: 0.35,
          transform: "translate3d(0,0,0) scale(0.92)",
          transition: "transform 260ms cubic-bezier(0.16,1,0.3,1), opacity 260ms ease-out",
        }}
      />

      <div
        ref={card}
        className="relative h-full [transform-style:preserve-3d]"
        style={{
          transform: "rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
          transition:
            "transform 260ms cubic-bezier(0.16,1,0.3,1), box-shadow 260ms ease-out",
        }}
      >
        {/* Content floats above the card plane, so it parallaxes as it turns. */}
        <div className="h-full [transform:translateZ(28px)] [transform-style:preserve-3d]">
          {children}
        </div>

        {glare && (
          // Clipped so the blur cannot bleed past the card's own edge.
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] [transform:translateZ(30px)]"
          >
            <div
              ref={sheen}
              className="absolute -inset-[25%] opacity-0"
              style={{
                filter: "blur(26px)",
                mixBlendMode: "soft-light",
                transition: "opacity 260ms ease-out",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
