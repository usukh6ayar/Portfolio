"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
      progress.current = THREE.MathUtils.clamp(
        1 - centre / window.innerHeight,
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
  }, [root]);

  return progress;
}

/**
 * Three primitives and a light rig — no downloaded asset, no scene service.
 * A faceted core, a ring cutting across it at an angle, and one small sphere
 * off to the side, lit so the acid rim reads against near-black.
 */
function Cluster({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const bead = useRef<THREE.Mesh>(null);
  const eased = useRef(0);
  const { invalidate } = useThree();

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current ?? 0;
    // Scroll leads, time keeps it alive when the page is still.
    eased.current += (p - eased.current) * (1 - Math.exp(-4 * delta));
    const t = clock.getElapsedTime();
    const s = eased.current;

    g.rotation.set(
      -0.35 + s * 0.9 + Math.sin(t * 0.25) * 0.05,
      s * Math.PI * 1.35 + t * 0.08,
      0.12 + s * 0.2,
    );
    const scale = 0.86 + s * 0.28;
    g.scale.setScalar(scale);
    g.position.y = (0.5 - s) * 0.35;

    if (ring.current) {
      ring.current.rotation.x = 1.25 - s * 0.8;
      ring.current.rotation.y = -s * Math.PI * 1.1 - t * 0.12;
    }
    if (bead.current) {
      bead.current.position.set(
        Math.cos(t * 0.4 + s * 3) * 1.5,
        0.75 - s * 0.5,
        Math.sin(t * 0.4 + s * 3) * 1.5,
      );
    }
    invalidate();
  });

  return (
    <group ref={group}>
      {/* Core — flat-shaded so the light breaks into facets. */}
      <mesh castShadow={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#15181d"
          roughness={0.34}
          metalness={0.22}
          flatShading
        />
      </mesh>

      {/* The one acid element: a thin ring cutting across the core. */}
      <mesh ref={ring}>
        <torusGeometry args={[1.52, 0.022, 16, 160]} />
        <meshStandardMaterial
          color="#b8f300"
          emissive="#b8f300"
          emissiveIntensity={0.55}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* A second, softer ring for depth. */}
      <mesh rotation={[0.9, 0.4, 0]}>
        <torusGeometry args={[1.22, 0.01, 12, 120]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={0.35}
          roughness={0.4}
        />
      </mesh>

      <mesh ref={bead}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color="#f5f5f0"
          emissive="#b8f300"
          emissiveIntensity={0.25}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

/**
 * The About section's object — built from primitives rather than a downloaded
 * model, so it carries the site's own palette and costs nothing but geometry.
 * Scroll drives its turn and scale; a slow drift keeps it alive when the page
 * is still. Frozen flat under reduced motion.
 */
export function AboutObject({ className }: { className?: string }) {
  const t = useTranslations("about");
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(rootRef);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 34 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced ? "demand" : "always"}
        aria-label={t("objectAlt")}
      >
        <ambientLight intensity={0.55} />
        {/* Key from the top right, acid rim from behind left, violet fill. */}
        <directionalLight position={[3.5, 4, 3]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-4, -1, -2.5]} intensity={3.2} color="#b8f300" />
        <directionalLight position={[-2, 3, -3]} intensity={0.9} color="#a78bfa" />
        <Cluster progress={progress} />
      </Canvas>
    </div>
  );
}
