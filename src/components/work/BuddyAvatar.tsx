"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

const MODEL = "/models/spark-fox.glb";

/** Gaze weights — roughly one turn, distributed down the spine. */
const GAZE: [string, number][] = [
  ["Head", 0.55],
  ["Neck", 0.28],
  ["Chest", 0.12],
  ["Spine", 0.05],
];

/** Ear chain, base to tip: the base swings most, the tip only trails. */
const EAR_SEGMENTS: [string, number][] = [
  ["ear_1", 1],
  ["ear_2", 0.6],
  ["ear_3", 0.35],
];

type Posed = { node: THREE.Object3D; rest: THREE.Euler };
type Reactions = {
  /** 1 while the pointer is over the canvas — ears forward, chin up. */
  hover: React.RefObject<boolean>;
  /** Timestamp of the last click; drives the hop once. */
  tapAt: React.RefObject<number>;
};

/**
 * Spark — the SparkXP AI buddy avatar, the same rigged GLB the app pulls from
 * Cloudflare R2, re-exported with meshopt so it lands in ~0.6 MB.
 *
 * The gaze is spread across the rig rather than yanking one bone: the head
 * turns most, the neck follows, the chest barely moves. On top of it sit four
 * additive layers — breath, ear twitch, alertness, hop — all summed onto each
 * bone's rest pose, so no layer has to know about the others. Everything is
 * clamped and damped, which is what makes it read as looking rather than
 * swivelling.
 */
function Rig({
  targetRef,
  reactions,
}: {
  targetRef: React.RefObject<{ x: number; y: number }>;
  reactions: Reactions;
}) {
  const { scene } = useGLTF(MODEL, false, true);
  const rig = useRef<{
    gaze: (Posed & { weight: number })[];
    ears: { side: "l" | "r"; segments: (Posed & { weight: number })[] }[];
    head: Posed | null;
    neck: Posed | null;
    chest: Posed | null;
  }>({ gaze: [], ears: [], head: null, neck: null, chest: null });

  // The hop moves the whole model, not a bone: bone space is rotated Z-up by
  // the Blender export, and scaling a joint would push it through the skin.
  const body = useRef<THREE.Group>(null);

  const current = useRef({ x: 0, y: 0 });
  const alert = useRef(0);
  const twitch = useRef({ at: 2.5, side: 0, t: -1 });

  useEffect(() => {
    const pose = (name: string): Posed | null => {
      const node = scene.getObjectByName(name);
      return node ? { node, rest: node.rotation.clone() } : null;
    };

    rig.current = {
      gaze: GAZE.flatMap(([name, weight]) => {
        const p = pose(name);
        return p ? [{ ...p, weight }] : [];
      }),
      ears: (["l", "r"] as const).map((side) => ({
        side,
        segments: EAR_SEGMENTS.flatMap(([name, weight]) => {
          const p = pose(`${name}.${side}`);
          return p ? [{ ...p, weight }] : [];
        }),
      })),
      head: pose("Head"),
      neck: pose("Neck"),
      chest: pose("Chest"),
    };
  }, [scene]);

  useFrame(({ clock }, delta) => {
    const t = targetRef.current;
    if (!t) return;
    const { gaze, ears, head, neck, chest } = rig.current;
    const time = clock.getElapsedTime();

    // Critically damped-ish follow; frame-rate independent.
    const k = 1 - Math.exp(-6 * delta);
    current.current.x += (t.x - current.current.x) * k;
    current.current.y += (t.y - current.current.y) * k;

    const x = THREE.MathUtils.clamp(current.current.x, -1, 1);
    const yaw = x * 0.62;
    const pitch = THREE.MathUtils.clamp(current.current.y, -1, 1) * 0.36;

    // — alertness: eased toward the hover state so it never snaps.
    alert.current +=
      ((reactions.hover.current ? 1 : 0) - alert.current) *
      (1 - Math.exp(-7 * delta));
    const perk = alert.current;

    // — hop: one 0.62s arc per click, with a little squash on the way down.
    const tapAt = reactions.tapAt.current;
    const p = tapAt ? (performance.now() - tapAt) / 620 : 1;
    const hop = p > 0 && p < 1 ? Math.sin(p * Math.PI) ** 1.4 : 0;

    // — breath: slow rise and fall, plus a slower sway so it is never a loop
    //   the eye can lock onto.
    const breath = Math.sin(time * 1.5) * 0.012 + Math.sin(time * 0.37) * 0.006;

    // — ear twitch: a flick on one side every few seconds, never both.
    const tw = twitch.current;
    if (tw.t < 0 && time > tw.at) {
      tw.t = 0;
      tw.side = Math.random() < 0.5 ? 0 : 1;
    }
    let flick = 0;
    if (tw.t >= 0) {
      tw.t += delta;
      const q = tw.t / 0.38;
      if (q >= 1) {
        tw.t = -1;
        tw.at = time + 3 + Math.random() * 4;
      } else {
        flick = Math.sin(q * Math.PI) * Math.sin(q * Math.PI * 3) * 0.34;
      }
    }

    // — curious tilt: the head rolls toward the side the pointer sits on.
    const tilt = x * 0.15;

    for (const { node, rest, weight } of gaze) {
      // The rig's bone frames are world-aligned, so a positive rotation about
      // local X drops the muzzle — pitch is subtracted to look *toward* the
      // pointer rather than away from it.
      node.rotation.set(
        rest.x - pitch * weight,
        rest.y + yaw * weight,
        rest.z,
      );
    }

    // Additive layers, applied after the gaze has written the base pose.
    if (chest) {
      chest.node.rotation.x += breath + hop * 0.05;
    }
    if (neck) {
      neck.node.rotation.z += tilt * 0.3;
    }
    if (head) {
      // Chin lifts on hover, dips through the middle of the hop.
      head.node.rotation.x += -perk * 0.05 + hop * 0.12;
      head.node.rotation.z += tilt * 0.6;
    }
    for (const [i, ear] of ears.entries()) {
      const own = tw.t >= 0 && tw.side === i ? flick : 0;
      for (const { node, rest, weight } of ear.segments) {
        // Forward and up when alert, backward on the flick, a beat behind on
        // the hop — the tip always lagging the base.
        node.rotation.set(
          rest.x + (-perk * 0.22 + own + hop * 0.18) * weight,
          rest.y,
          rest.z + (i === 0 ? -1 : 1) * perk * 0.06 * weight,
        );
      }
    }
    if (body.current) {
      body.current.position.y = -0.66 + hop * 0.075;
      const stretch = 1 + hop * 0.05;
      body.current.scale.set(1.62 / stretch, 1.62 * stretch, 1.62 / stretch);
    }
  });

  return (
    <group ref={body} position={[0, -0.66, 0]} scale={1.62}>
      <primitive object={scene} />
    </group>
  );
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
  const hover = useRef(false);
  const tapAt = useRef(0);
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
      <div
        className="relative aspect-[4/3] w-full sm:aspect-[16/10]"
        data-cursor="interactive"
        onPointerEnter={() => {
          hover.current = true;
        }}
        onPointerLeave={() => {
          hover.current = false;
        }}
        onPointerDown={() => {
          tapAt.current = performance.now();
        }}
      >
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
            <Rig targetRef={targetRef} reactions={{ hover, tapAt }} />
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
