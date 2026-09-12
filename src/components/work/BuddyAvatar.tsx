"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

const MODEL = "/models/spark-fox.glb";

/**
 * Spark — the SparkXP AI buddy avatar, the same rigged GLB the app pulls from
 * Cloudflare R2, re-exported with meshopt so it lands in ~0.6 MB.
 *
 * The gaze is spread across the rig rather than yanking one bone: the head
 * turns most, the neck follows, the chest barely moves. Everything is clamped
 * and damped, which is what makes it read as looking rather than swivelling.
 */
function Rig({ targetRef }: { targetRef: React.RefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF(MODEL, false, true);
  const bones = useRef<{ node: THREE.Object3D; rest: THREE.Euler; weight: number }[]>([]);
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Weights sum to roughly one turn, distributed down the spine.
    const plan: [string, number][] = [
      ["Head", 0.55],
      ["Neck", 0.28],
      ["Chest", 0.12],
      ["Spine", 0.05],
    ];
    bones.current = plan.flatMap(([name, weight]) => {
      const node = scene.getObjectByName(name);
      return node ? [{ node, rest: node.rotation.clone(), weight }] : [];
    });
  }, [scene]);

  useFrame((_, delta) => {
    const t = targetRef.current;
    if (!t) return;
    // Critically damped-ish follow; frame-rate independent.
    const k = 1 - Math.exp(-6 * delta);
    current.current.x += (t.x - current.current.x) * k;
    current.current.y += (t.y - current.current.y) * k;

    const yaw = THREE.MathUtils.clamp(current.current.x, -1, 1) * 0.62;
    const pitch = THREE.MathUtils.clamp(current.current.y, -1, 1) * 0.36;

    for (const { node, rest, weight } of bones.current) {
      // The rig's bone frames are world-aligned, so a positive rotation about
      // local X drops the muzzle — pitch is subtracted to look *toward* the
      // pointer rather than away from it.
      node.rotation.set(
        rest.x - pitch * weight,
        rest.y + yaw * weight,
        rest.z,
      );
    }
  });

  return <primitive object={scene} position={[0, -0.66, 0]} scale={1.62} />;
}

/** Pointer position as -1..1 across the canvas, or a slow idle drift. */
function Pointer({
  targetRef,
  idle,
}: {
  targetRef: React.RefObject<{ x: number; y: number }>;
  idle: boolean;
}) {
  const { gl } = useThree();
  const client = useRef<{ x: number; y: number } | null>(null);
  const rect = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (idle) return;
    const onMove = (e: PointerEvent) => {
      client.current = { x: e.clientX, y: e.clientY };
    };
    // The canvas slides under a motionless cursor as the page scrolls, so the
    // cached rect is invalidated rather than measured on every frame.
    const invalidate = () => {
      rect.current = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [idle]);

  useFrame(({ clock }) => {
    const at = client.current;
    // Until a pointer shows up — touch, or a visitor who has only scrolled —
    // the gaze wanders instead of staring blankly ahead.
    if (idle || !at) {
      const t = clock.getElapsedTime();
      targetRef.current = {
        x: Math.sin(t * 0.35) * 0.7,
        y: Math.sin(t * 0.23) * 0.25,
      };
      return;
    }

    const r = (rect.current ??= gl.domElement.getBoundingClientRect());
    // Track across the viewport, not just the canvas, so the gaze still reads
    // when the cursor is beside the model rather than over it.
    targetRef.current = {
      x: ((at.x - (r.left + r.width / 2)) / (window.innerWidth / 2)) * 1.1,
      y: -((at.y - (r.top + r.height / 2)) / (window.innerHeight / 2)) * 1.1,
    };
  });

  return null;
}

export function BuddyAvatar({ className }: { className?: string }) {
  const t = useTranslations("work.buddy");
  const reduced = useReducedMotion();
  const targetRef = useRef({ x: 0, y: 0 });
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-border bg-surface-1",
        "shadow-[0_24px_64px_-40px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 12%, rgba(167,139,250,0.16) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <Canvas
          camera={{ position: [0, 0.08, 2.5], fov: 34 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          // A still model is the whole point under reduced motion: render once.
          frameloop={reduced ? "demand" : "always"}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[2.5, 3, 2.5]} intensity={2.1} />
          <directionalLight position={[-2.5, 1, -1.5]} intensity={0.6} color="#a78bfa" />
          <Suspense fallback={null}>
            <Rig targetRef={targetRef} />
            {!reduced && <Pointer targetRef={targetRef} idle={coarse} />}
          </Suspense>
        </Canvas>
      </div>
      <figcaption className="relative border-t border-border px-5 py-3.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
        {reduced || coarse ? t("captionStatic") : t("caption")}
      </figcaption>
    </figure>
  );
}

useGLTF.preload(MODEL, false, true);
