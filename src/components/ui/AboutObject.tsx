"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Scroll progress through the section, 0 before it arrives and 1 once it has
 * passed. Written to a ref rather than state: nothing here re-renders.
 */
function useScrollProgress(root: React.RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      const centre = r.top + r.height / 2;
      progress.current = THREE.MathUtils.clamp(1 - centre / window.innerHeight, 0, 1);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [root]);

  return progress;
}

/** Bottom to top: the layers a product is actually built in. */
const LAYERS = [
  { key: "data", color: "#2a303a", edge: "#6b7686", width: 1, offset: -1 },
  { key: "logic", color: "#333a46", edge: "#a78bfa", width: 1.4, offset: 0 },
  { key: "ui", color: "#3d4552", edge: "#b8f300", width: 2, offset: 1 },
];

/**
 * Three slabs floating one above another — the layers of an interface seen
 * edge-on. Scrolling pulls them apart and turns the stack; at rest they drift.
 */
function Stack({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const slabs = useRef<(THREE.Group | null)[]>([]);
  const eased = useRef(0);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current ?? 0;
    eased.current += (p - eased.current) * (1 - Math.exp(-4 * delta));
    const s = eased.current;
    const t = clock.getElapsedTime();

    // Looking down on the stack, turning a little further as the page moves.
    g.rotation.set(
      0.78 - s * 0.22 + Math.sin(t * 0.3) * 0.02,
      -0.55 + s * 1.15 + t * 0.06,
      0,
    );
    g.position.y = (0.5 - s) * 0.3;

    for (const [i, slab] of slabs.current.entries()) {
      if (!slab) continue;
      const layer = LAYERS[i];
      // Separation grows with scroll; each layer breathes on its own phase.
      const gap = 0.42 + s * 0.55;
      slab.position.y = layer.offset * gap + Math.sin(t * 0.7 + i * 1.6) * 0.035;
      slab.position.x = layer.offset * s * 0.12;
      slab.rotation.z = Math.sin(t * 0.35 + i) * 0.012;
    }
  });

  return (
    <group ref={group}>
      {LAYERS.map((layer, i) => (
        <group
          key={layer.key}
          ref={(el) => {
            slabs.current[i] = el;
          }}
        >
          {/* A hard-edged box on purpose: Edges finds nothing to draw on a
              rounded one, and the outline is what reads at this angle. */}
          <mesh>
            <boxGeometry args={[2.6, 0.07, 1.75]} />
            <meshStandardMaterial
              color={layer.color}
              roughness={0.5}
              metalness={0.2}
            />
            <Edges threshold={15} color={layer.edge} lineWidth={layer.width} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * The About section's object — the layers of a product rather than a
 * decorative shape, built from primitives so it carries the site's own palette
 * and costs no downloaded asset. Scroll pulls the stack apart and turns it.
 * Frozen flat under reduced motion.
 */
export function AboutObject({ className }: { className?: string }) {
  const t = useTranslations("about");
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(rootRef);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 34 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced ? "demand" : "always"}
        aria-label={t("objectAlt")}
      >
        <ambientLight intensity={1.1} />
        {/* Key from the top right, acid bounce from below left, violet fill. */}
        <directionalLight position={[3.5, 5, 3]} intensity={3.2} color="#ffffff" />
        <directionalLight position={[-3.5, -2, 1.5]} intensity={2.2} color="#b8f300" />
        <directionalLight position={[-2, 3, -3]} intensity={1.4} color="#a78bfa" />
        <Stack progress={progress} />
      </Canvas>
    </div>
  );
}
