"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import type { Mesh, MeshStandardMaterial } from "three";
import { Color } from "three";
import { useRecordMode } from "@/challenge/record-mode";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Starter — the template every challenge site is copied from.
 *
 * Shows the three moving parts working together:
 *   • page scroll (Lenis, from the root providers) → ScrollTrigger progress
 *   • progress → a React Three Fiber scene, read every frame from a ref
 *   • record mode → the whole thing plays hands-free (?record=1)
 *
 * Keep the pattern: scroll writes to a ref, the scene reads the ref in
 * useFrame. No React state on scroll, so nothing re-renders at 60fps.
 */

const FROM = new Color("#b8f300");
const TO = new Color("#a78bfa");

function Shape({ progress }: { progress: { current: number } }) {
  const mesh = useRef<Mesh>(null);
  const reduced = useReducedMotion();

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const p = progress.current;
    if (!reduced) m.rotation.y += delta * 0.4;
    m.rotation.x = p * Math.PI * 2;
    m.scale.setScalar(1 + p * 0.6);
    (m.material as MeshStandardMaterial).color.lerpColors(FROM, TO, p);
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial flatShading roughness={0.35} metalness={0.2} />
    </mesh>
  );
}

export default function StarterSite() {
  const t = useTranslations("challenge.sites.starter");
  const record = useRecordMode();
  const rootRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative bg-[#0b0b0f] text-[#f5f5f0]">
      <div className="pointer-events-none fixed inset-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 5]} intensity={2} />
          <Shape progress={progress} />
        </Canvas>
      </div>

      {[0, 1, 2].map((i) => (
        <section
          key={i}
          className="relative flex min-h-[100svh] items-end px-6 pb-16 sm:px-12"
        >
          {i === 0 && (
            <div className="max-w-xl">
              <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
                {t("title")}
              </h1>
              <p className="mt-4 text-base text-[#f5f5f0]/70">{t("tagline")}</p>
              {record.active && (
                <p className="mt-6 font-mono text-xs text-[#b8f300]">
                  record · {record.duration}s
                </p>
              )}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
