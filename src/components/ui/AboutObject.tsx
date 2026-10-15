"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "@/hooks/useInView";
import { MONGOL_NAME } from "@/lib/mongol-name";
import { cn } from "@/lib/cn";

/** Font units → scene units: the word fills most of the frame's height. */
const UNIT = 5.3 / MONGOL_NAME.height;
/**
 * The stem every letter hangs from sits this far right of the word's centre,
 * in font units. The word turns about the stem, so it spins in place rather
 * than sweeping from side to side.
 */
const STEM_X = 72;
/** Extrusion in font units; a stroke is ~70, so the letters read as solid. */
const DEPTH = 150;
/** Idle turn, radians per second. */
const SPIN = 0.45;
/** Radians of turn per pixel dragged. */
const DRAG = 0.009;
/** How far the word may be tipped toward or away from the viewer. */
const MAX_TILT = 0.5;

type Drag = {
  active: boolean;
  /** Turn and tilt the pointer has added in all, ever; frames read the change. */
  turn: number;
  tilt: number;
  /** Radians per second the turn carries on with after a release. */
  velocity: number;
};

/**
 * Drag to turn the word. Horizontal drags spin it, vertical ones tip it. On
 * touch only the horizontal drag is taken — `touch-action: pan-y` on the
 * element leaves the vertical one to scroll the page.
 */
function useDrag(target: React.RefObject<HTMLElement | null>) {
  const drag = useRef<Drag>({ active: false, turn: 0, tilt: 0, velocity: 0 });

  useEffect(() => {
    const element = target.current;
    if (!element) return;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      element.setPointerCapture(event.pointerId);
      drag.current.active = true;
      drag.current.velocity = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = event.timeStamp;
    };
    const move = (event: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const dt = Math.max(1, event.timeStamp - lastTime) / 1000;
      drag.current.turn += dx * DRAG;
      drag.current.tilt += dy * DRAG;
      // Smoothed, so one jittery sample doesn't decide the throw.
      drag.current.velocity +=
        ((dx * DRAG) / dt - drag.current.velocity) * 0.5;
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = event.timeStamp;
    };
    const up = (event: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      // A pointer held still before letting go throws nothing.
      if (event.timeStamp - lastTime > 80) drag.current.velocity = 0;
      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }
    };

    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
    };
  }, [target]);

  return drag;
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
      // Centre the depth too, so the word turns about its own middle.
      geometry.translate(0, 0, -DEPTH / 2);
      return geometry;
    });
  }, []);

  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);
  return geometries;
}

/**
 * The name, written top to bottom, as one solid white word that turns slowly
 * on its vertical axis. Dragging takes over the turn; let go and it carries
 * on with the throw, then settles back into its own pace.
 */
function SpinningName({
  drag,
  reduced,
}: {
  drag: React.RefObject<Drag>;
  reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const tilt = useRef(0);
  const throwSpeed = useRef(0);
  const seen = useRef({ turn: 0, tilt: 0 });
  const geometries = useGlyphGeometries();

  useFrame(({ clock }, delta) => {
    const group = root.current;
    if (!group) return;
    const state = drag.current;

    group.rotation.y += state.turn - seen.current.turn;
    tilt.current = THREE.MathUtils.clamp(
      tilt.current + state.tilt - seen.current.tilt,
      -MAX_TILT,
      MAX_TILT,
    );
    seen.current.turn = state.turn;
    seen.current.tilt = state.tilt;

    if (state.active) {
      throwSpeed.current = state.velocity;
    } else {
      group.rotation.y += ((reduced ? 0 : SPIN) + throwSpeed.current) * delta;
      throwSpeed.current *= Math.exp(-2.2 * delta);
      tilt.current *= Math.exp(-3 * delta);
    }
    group.rotation.x = tilt.current;
    group.position.y = reduced
      ? 0
      : Math.sin(clock.getElapsedTime() * 0.55) * 0.045;
  });

  return (
    <group ref={root}>
      {MONGOL_NAME.glyphs.map((glyph, index) => (
        <mesh
          key={index}
          geometry={geometries[index]}
          position={[(glyph.x - STEM_X) * UNIT, glyph.y * UNIT, 0]}
          scale={UNIT}
        >
          <meshStandardMaterial
            color="#dfe1e6"
            metalness={1}
            roughness={0.24}
          />
        </mesh>
      ))}
    </group>
  );
}

export function AboutObject({ className }: { className?: string }) {
  const t = useTranslations("about");
  const reduced = useReducedMotion();
  const compact = useMediaQuery("(max-width: 640px)");
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useDrag(rootRef);
  // The canvas stays mounted once loaded; it only needs to draw while seen.
  const inView = useInView(rootRef, "120px 0px");

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative cursor-grab touch-pan-y select-none active:cursor-grabbing",
        className,
      )}
    >
      <Canvas
        camera={{ position: [0, 0.1, 10.2], fov: 32 }}
        dpr={compact ? [1, 1.35] : [1, 1.65]}
        gl={{ antialias: true, alpha: true }}
        frameloop={inView ? "always" : "demand"}
        aria-label={t("objectAlt")}
      >
        {/*
         * Metal shows what it reflects, so the letters get a studio to
         * reflect: white panels on black, built in place rather than an HDR
         * fetched from a CDN. The bright strips run across the faces as the
         * word turns. Neutral white, so the silver stays silver.
         */}
        <Environment resolution={256}>
          {/* A grey room, so faces turned from every panel read as dark steel, not as holes. */}
          <color attach="background" args={["#2c2d31"]} />
          <Lightformer
            form="rect"
            intensity={4}
            position={[0, 6, 3]}
            scale={[12, 1.6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            position={[2.5, 1, 7]}
            scale={[0.7, 9, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2.6}
            position={[-7, 0, 1]}
            scale={[1.4, 14, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2.6}
            position={[7, -1, -1]}
            scale={[1.4, 14, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1}
            position={[0, -6, 2]}
            scale={[12, 1, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[0, 1, -7]}
            scale={[0.9, 12, 1]}
          />
        </Environment>
        <directionalLight position={[4, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <group scale={compact ? 0.94 : 1}>
            <SpinningName drag={drag} reduced={reduced} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
