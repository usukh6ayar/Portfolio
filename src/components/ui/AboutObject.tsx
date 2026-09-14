"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

function useScrollProgress(root: React.RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const read = () => {
      const rect = element.getBoundingClientRect();
      const centre = rect.top + rect.height / 2;
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

function usePointer(root: React.RefObject<HTMLElement | null>) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = root.current;
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
  }, [root]);

  return pointer;
}

const ACCENT = "#b8f300";
const VIOLET = "#a78bfa";
const METAL = "#252a31";
const RING = "#707a89";

/**
 * A continuous product loop rather than a generic node network. The knot is
 * one unbroken surface (product ownership end to end); the three orbiting
 * signals stand for interface, system and delivery moving around one core.
 */
function ProductLoop({
  progress,
  pointer,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const root = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const signals = useRef<(THREE.Mesh | null)[]>([]);
  const easedProgress = useRef(0);
  const lean = useRef({ x: 0, y: 0 });

  useFrame(({ clock }, delta) => {
    const group = root.current;
    if (!group) return;

    const time = clock.getElapsedTime();
    const damping = 1 - Math.exp(-3.2 * delta);
    const target = pointer.current;

    lean.current.x += (target.y * 0.16 - lean.current.x) * damping;
    lean.current.y += (target.x * 0.24 - lean.current.y) * damping;
    easedProgress.current +=
      (progress.current - easedProgress.current) *
      (1 - Math.exp(-4 * delta));

    group.rotation.x = -0.18 + lean.current.x;
    group.rotation.y = 0.18 + lean.current.y;
    group.position.y = (0.5 - easedProgress.current) * 0.24;
    group.scale.setScalar(0.94 + easedProgress.current * 0.06);

    if (knot.current) {
      knot.current.rotation.x = time * 0.055;
      knot.current.rotation.y = -time * 0.075;
      knot.current.rotation.z = Math.sin(time * 0.28) * 0.08;
    }

    rings.current.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.z = time * (index === 1 ? -0.055 : 0.04) + index * 1.9;
    });

    signals.current.forEach((signal, index) => {
      if (!signal) return;
      const speed = 0.22 + index * 0.035;
      const phase = time * speed + index * (Math.PI * 2) / 3;
      const radius = 2.35 + index * 0.08;
      signal.position.set(
        Math.cos(phase) * radius,
        Math.sin(phase) * radius * 0.62,
        Math.sin(phase * 1.35 + index) * 0.72,
      );
      signal.rotation.x = time * 0.25 + index;
      signal.rotation.y = time * 0.32 - index;
    });
  });

  return (
    <group ref={root}>
      <group ref={knot} rotation={[-0.12, 0.2, -0.2]}>
        <mesh>
          <torusKnotGeometry args={[1.24, 0.34, 192, 28, 2, 3]} />
          <meshStandardMaterial color={METAL} roughness={0.3} metalness={0.82} />
        </mesh>
        <mesh scale={1.006}>
          <torusKnotGeometry args={[1.24, 0.34, 192, 28, 2, 3]} />
          <meshBasicMaterial
            color={ACCENT}
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>
      </group>

      {[
        [Math.PI / 2.5, 0.1, 0],
        [Math.PI / 2.8, Math.PI / 2.3, 0.35],
      ].map((rotation, index) => (
        <mesh
          key={index}
          ref={(element) => {
            rings.current[index] = element;
          }}
          rotation={rotation as [number, number, number]}
        >
          <torusGeometry args={[2.18 + index * 0.25, 0.014, 8, 160]} />
          <meshBasicMaterial
            color={index === 0 ? RING : VIOLET}
            transparent
            opacity={index === 0 ? 0.36 : 0.22}
          />
        </mesh>
      ))}

      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(element) => {
            signals.current[index] = element;
          }}
        >
          {index === 0 ? (
            <octahedronGeometry args={[0.12, 0]} />
          ) : index === 1 ? (
            <boxGeometry args={[0.16, 0.16, 0.16]} />
          ) : (
            <icosahedronGeometry args={[0.11, 1]} />
          )}
          <meshStandardMaterial
            color={index === 1 ? VIOLET : ACCENT}
            emissive={index === 1 ? VIOLET : ACCENT}
            emissiveIntensity={0.55}
            roughness={0.28}
            metalness={0.55}
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
  const progress = useScrollProgress(rootRef);
  const pointer = usePointer(rootRef);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Canvas
        camera={{ position: [0, 0, compact ? 8.4 : 7.6], fov: 34 }}
        dpr={compact ? [1, 1.35] : [1, 1.65]}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced ? "demand" : "always"}
        aria-label={t("objectAlt")}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[3.5, 5, 4]} intensity={3.4} color="#ffffff" />
        <directionalLight position={[-4, -2, 2]} intensity={2.2} color={ACCENT} />
        <directionalLight position={[-2, 3, -4]} intensity={1.7} color={VIOLET} />
        <ProductLoop progress={progress} pointer={pointer} />
      </Canvas>
    </div>
  );
}
