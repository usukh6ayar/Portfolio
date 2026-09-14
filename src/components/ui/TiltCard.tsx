"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * A card lit from wherever the pointer is.
 *
 * The tilt alone never reads as three-dimensional — a rotated flat image still
 * looks flat. What sells it is light: a specular sheen that slides across the
 * surface, and a rim that brightens on the edge facing the pointer. The only
 * shadow is the one the content itself casts, so nothing of a shape the image
 * does not have ever appears outside it.
 *
 * Sheen and rim ride the *same* plane and the *same* corner radius as the
 * content. Drawn on the card plane instead, they parallax away from the image
 * under tilt and read as a square sheet of plastic floating around it.
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
  /** Sheen and rim, clipped to the card's radius — cut-out devices pass false. */
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  glare?: boolean;
}) {
  const card = useRef<HTMLDivElement>(null);
  const rim = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
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
    if (rim.current) rim.current.style.opacity = "0";
    if (sheen.current) sheen.current.style.opacity = "0";
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
    if (rim.current) {
      // Rim light on the edge the pointer is over, as a light above it would.
      rim.current.style.opacity = "1";
      rim.current.style.boxShadow =
        `inset ${-x * 10}px ${-y * 10}px 44px -22px rgba(255,255,255,0.26)`;
    }
    if (sheen.current) {
      sheen.current.style.opacity = "1";
      // Wide and low-contrast, then blurred by the layer itself: a hard-edged
      // disc reads as a white ball rather than light on a surface.
      sheen.current.style.background =
        `radial-gradient(58% 78% at ${((x + 1) / 2) * 100}% ${((y + 1) / 2) * 100}%, ` +
        `rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.07) 38%, transparent 76%)`;
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
        // The radius chains down from the stage's own class, so the rim and
        // sheen below land on the content's corners, not a square bounding box.
        className="relative h-full rounded-[inherit] [transform-style:preserve-3d]"
        style={{
          transform: "rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
          transition: "transform 260ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Kept on the card plane. A permanent translateZ magnifies the layer
            and Chrome rasterises it once at that scale, which is a standing
            blur on a screenshot whose whole job is legible UI. */}
        <div className="h-full [transform-style:preserve-3d]">
          {children}
        </div>

        {glare && (
          // One layer for both: it carries the rim as an inset shadow and clips
          // the sheen, and it rides just above the content so the light stays
          // welded to the image rather than parallaxing off it.
          <div
            ref={rim}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-0 [transform:translateZ(1px)]"
            style={{ transition: "opacity 260ms ease-out, box-shadow 260ms ease-out" }}
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
