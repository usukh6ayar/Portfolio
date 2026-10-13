"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "@/hooks/useInView";
import { MONGOL_NAME } from "@/lib/mongol-name";
import { cn } from "@/lib/cn";

/** Font units → scene units: the word stands just under the frame's height. */
const UNIT = 4.9 / MONGOL_NAME.height;
/** Extrusion in font units; a stroke is ~70, so the letters read as solid. */
const DEPTH = 150;
/** The first letter of each half of the name — өсөх, баяр — is lit acid. */
const ACCENT = new Set([0, 4]);
/** Resting turn, so the extrusion shows even before the pointer moves. */
const REST_TURN = -0.34;

function smoothstep(start: number, end: number, value: number) {
  const x = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return x * x * (3 - 2 * x);
}

/**
 * 0 → 1 through the scroll. "section": across the whole About section, for
 * the desktop layout where the object is pinned beside it. "element": as the
 * object itself crosses the viewport, for the stacked layout, where the object
 * scrolls away long before the section ends and would never be seen whole.
 */
function useScrollProgress(
  target: React.RefObject<HTMLElement | null>,
  mode: "section" | "element",
) {
  const progress = useRef(0);

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    const read = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (mode === "element") {
        progress.current = THREE.MathUtils.clamp(
          (viewport - rect.top) / (viewport + rect.height),
          0,
          1,
        );
        return;
      }
      const start = viewport * 0.12;
      const end = viewport * 0.88;
      const distance = Math.max(1, rect.height + start - end);
      progress.current = THREE.MathUtils.clamp(
        (start - rect.top) / distance,
        0,
        1,
      );
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [target, mode]);

  return progress;
}

function usePointer(target: React.RefObject<HTMLElement | null>) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    const read = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      pointer.current.x = THREE.MathUtils.clamp(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -1,
        1,
      );
      pointer.current.y = THREE.MathUtils.clamp(
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
        -1,
        1,
      );
    };

    window.addEventListener("pointermove", read, { passive: true });
    return () => window.removeEventListener("pointermove", read);
  }, [target]);

  return pointer;
}

/**
 * One extruded mesh per glyph. The outlines arrive as SVG path data, so
 * three's own SVGLoader parses them and `toShapes` finds the holes; and
 * ExtrudeGeometry gives them depth and a small bevel.
 */
function useGlyphGeometries() {
  const geometries = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg">${MONGOL_NAME.glyphs
      .map((glyph) => `<path d="${glyph.d}"/>`)
      .join("")}</svg>`;
    const { paths } = new SVGLoader().parse(svg);
    return paths.map((path) => {
      const geometry = new THREE.ExtrudeGeometry(path.toShapes(), {
        depth: DEPTH,
        curveSegments: 7,
        bevelEnabled: true,
        bevelSize: 9,
        bevelThickness: 12,
        bevelSegments: 3,
      });
      // Centre the depth too, so each letter turns about its own middle.
      geometry.translate(0, 0, -DEPTH / 2);
      return geometry;
    });
  }, []);

  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);
  return geometries;
}

/**
 * The name, written top to bottom. Scrolling into the section brings the
 * letters in from either side to join into the word, the way the script joins
 * its letters; scrolling past sends them apart again. The pointer tilts the
 * whole word so the depth reads.
 */
function KineticName({
  progress,
  pointer,
  reduced,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const letters = useRef<Array<THREE.Group | null>>([]);
  const easedProgress = useRef(reduced ? 0.5 : 0);
  const pointerLean = useRef({ x: 0, y: 0 });
  const geometries = useGlyphGeometries();

  useFrame(({ clock }, delta) => {
    const group = root.current;
    if (!group) return;

    const targetProgress = reduced ? 0.5 : progress.current;
    easedProgress.current +=
      (targetProgress - easedProgress.current) * (1 - Math.exp(-5.4 * delta));
    const p = easedProgress.current;
    const assembled = reduced ? 1 : smoothstep(0.08, 0.4, p);
    const scattered = reduced ? 0 : smoothstep(0.74, 0.97, p);

    MONGOL_NAME.glyphs.forEach((glyph, index) => {
      const letter = letters.current[index];
      if (!letter) return;
      const homeX = glyph.x * UNIT;
      const homeY = glyph.y * UNIT;
      const direction = index % 2 === 0 ? -1 : 1;
      const wobble = ((index * 7) % 5) - 2;
      const startX = homeX + direction * (1.7 + (index % 3) * 0.28);
      const startY = homeY + wobble * 0.12;
      const startZ = -1.3 - (index % 4) * 0.24;
      const endX = homeX + direction * (2.4 + (index % 3) * 0.32);
      const endY = homeY - wobble * 0.18;
      const endZ = 0.9 + (index % 4) * 0.2;

      const settledX = THREE.MathUtils.lerp(startX, homeX, assembled);
      const settledY = THREE.MathUtils.lerp(startY, homeY, assembled);
      const settledZ = THREE.MathUtils.lerp(startZ, 0, assembled);
      letter.position.set(
        THREE.MathUtils.lerp(settledX, endX, scattered),
        THREE.MathUtils.lerp(settledY, endY, scattered),
        THREE.MathUtils.lerp(settledZ, endZ, scattered),
      );

      const startTurn = direction * (Math.PI * 0.5 + index * 0.03);
      const endTurn = -direction * (Math.PI * 0.55 + index * 0.025);
      letter.rotation.set(
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(wobble * 0.14, 0, assembled),
          -wobble * 0.16,
          scattered,
        ),
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(startTurn, 0, assembled),
          endTurn,
          scattered,
        ),
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(direction * 0.2, 0, assembled),
          direction * 0.26,
          scattered,
        ),
      );

      const scale = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.7, 1, assembled),
        0.6,
        scattered,
      );
      letter.scale.setScalar(scale * UNIT);
    });

    const damping = 1 - Math.exp(-4 * delta);
    pointerLean.current.x +=
      (pointer.current.y * 0.05 - pointerLean.current.x) * damping;
    pointerLean.current.y +=
      (pointer.current.x * 0.28 - pointerLean.current.y) * damping;
    group.rotation.x = pointerLean.current.x;
    group.rotation.y = REST_TURN + pointerLean.current.y;
    group.position.y = Math.sin(clock.getElapsedTime() * 0.55) * 0.045;
  });

  return (
    <group ref={root}>
      {MONGOL_NAME.glyphs.map((glyph, index) => (
        <group
          key={index}
          ref={(node) => {
            letters.current[index] = node;
          }}
        >
          <mesh geometry={geometries[index]}>
            <meshStandardMaterial
              color={ACCENT.has(index) ? "#b8f300" : "#f5f5f0"}
              metalness={0.38}
              roughness={0.28}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function AboutObject({
  className,
  sectionRef,
}: {
  className?: string;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const t = useTranslations("about");
  const reduced = useReducedMotion();
  const compact = useMediaQuery("(max-width: 640px)");
  const rootRef = useRef<HTMLDivElement>(null);
  // Matches About's lg breakpoint, where the object's column turns sticky.
  const pinned = useMediaQuery("(min-width: 1024px)");
  const progress = useScrollProgress(
    pinned ? sectionRef : rootRef,
    pinned ? "section" : "element",
  );
  const pointer = usePointer(rootRef);
  // The canvas stays mounted once loaded; it only needs to draw while seen.
  const inView = useInView(rootRef, "120px 0px");

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Canvas
        camera={{ position: [0, 0.1, 10.2], fov: 32 }}
        dpr={compact ? [1, 1.35] : [1, 1.65]}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced || !inView ? "demand" : "always"}
        aria-label={t("objectAlt")}
      >
        <ambientLight intensity={1.55} />
        <directionalLight position={[4, 5, 5]} intensity={3.1} />
        <directionalLight
          position={[-4, 1, 3]}
          intensity={1.15}
          color="#b8f300"
        />
        <directionalLight
          position={[1, 3, -4]}
          intensity={0.85}
          color="#a78bfa"
        />
        <Suspense fallback={null}>
          <group scale={compact ? 0.78 : 1}>
            <KineticName
              progress={progress}
              pointer={pointer}
              reduced={reduced}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
