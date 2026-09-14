"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

const FONT = "/fonts/helvetiker_bold.typeface.json";
const WORD = Array.from("USUKHBAYAR");
const CODE = [
  "const craft = ['design', 'code', 'ship'];",
  "const product = build({",
  "  clarity: true,",
  "  ownership: 'end-to-end',",
  "});",
  "ship(product);",
];

function smoothstep(start: number, end: number, value: number) {
  const x = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return x * x * (3 - 2 * x);
}

function useScrollProgress(target: React.RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    const read = () => {
      const rect = element.getBoundingClientRect();
      const start = window.innerHeight * 0.12;
      const end = window.innerHeight * 0.88;
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
  }, [target]);

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

function drawCode(
  context: CanvasRenderingContext2D,
  visibleCharacters: number,
  cursorVisible: boolean,
) {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);

  const lineHeight = 66;
  const topBaseline = 74;
  const bottomBaseline = 610;
  let remaining = visibleCharacters;
  let cursorX = 116;
  let cursorY = topBaseline;

  CODE.forEach((line, index) => {
    const row = index < 3 ? index : index - 3;
    const y =
      (index < 3 ? topBaseline : bottomBaseline) + row * lineHeight;
    const shown = line.slice(0, Math.max(0, remaining));

    context.font = "500 25px ui-monospace, SFMono-Regular, Menlo, monospace";
    context.fillStyle = "rgba(245, 245, 240, 0.23)";
    context.textAlign = "right";
    context.fillText(String(index + 1).padStart(2, "0"), 82, y);

    context.font = "600 31px ui-monospace, SFMono-Regular, Menlo, monospace";
    context.textAlign = "left";
    context.fillStyle =
      index === CODE.length - 1
        ? "rgba(184, 243, 0, 0.74)"
        : index === 3
          ? "rgba(167, 139, 250, 0.58)"
          : "rgba(245, 245, 240, 0.52)";
    context.fillText(shown, 116, y);

    if (remaining >= 0 && remaining <= line.length) {
      cursorX = 116 + context.measureText(shown).width + 7;
      cursorY = y;
    }
    remaining -= line.length + 1;
  });

  if (cursorVisible) {
    context.fillStyle = "rgba(184, 243, 0, 0.82)";
    context.fillRect(cursorX, cursorY - 31, 4, 40);
  }
}

function useCodeTexture() {
  const surface = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 800;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D is unavailable");

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return { context, texture };
  }, []);
  const textureRef = useRef(surface.texture);

  useEffect(() => () => surface.texture.dispose(), [surface]);

  const redraw = useCallback(
    (visibleCharacters: number, cursorVisible: boolean) => {
      drawCode(surface.context, visibleCharacters, cursorVisible);
      textureRef.current.needsUpdate = true;
    },
    [surface],
  );

  return { texture: surface.texture, redraw };
}

function KineticType({
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
  const codeMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const easedProgress = useRef(reduced ? 0.5 : 0);
  const pointerLean = useRef({ x: 0, y: 0 });
  const lastCodeFrame = useRef({ characters: -1, cursor: false });
  const { texture, redraw } = useCodeTexture();
  const totalCharacters = CODE.reduce(
    (total, line) => total + line.length + 1,
    0,
  );

  useFrame(({ clock }, delta) => {
    const group = root.current;
    if (!group) return;

    const targetProgress = reduced ? 0.5 : progress.current;
    easedProgress.current +=
      (targetProgress - easedProgress.current) * (1 - Math.exp(-5.4 * delta));
    const p = easedProgress.current;
    const assembled = reduced ? 1 : smoothstep(0.08, 0.36, p);
    const scattered = reduced ? 0 : smoothstep(0.72, 0.96, p);

    letters.current.forEach((letter, index) => {
      if (!letter) return;
      const centerX = (index - (WORD.length - 1) / 2) * 0.69;
      const direction = index % 2 === 0 ? -1 : 1;
      const vertical = ((index * 7) % 5) - 2;
      const startX = centerX + direction * (1.9 + (index % 3) * 0.22);
      const startY = vertical * 0.28;
      const startZ = -1.2 - (index % 4) * 0.22;
      const endX = centerX + direction * (2.8 + (index % 3) * 0.3);
      const endY = -vertical * 0.32 + direction * 0.28;
      const endZ = 0.9 + (index % 4) * 0.18;

      const settledX = THREE.MathUtils.lerp(startX, centerX, assembled);
      const settledY = THREE.MathUtils.lerp(startY, 0, assembled);
      const settledZ = THREE.MathUtils.lerp(startZ, 0, assembled);
      letter.position.set(
        THREE.MathUtils.lerp(settledX, endX, scattered),
        THREE.MathUtils.lerp(settledY, endY, scattered),
        THREE.MathUtils.lerp(settledZ, endZ, scattered),
      );

      const startTurn = direction * (Math.PI * 0.48 + index * 0.025);
      const endTurn = -direction * (Math.PI * 0.56 + index * 0.02);
      letter.rotation.set(
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(vertical * 0.12, 0, assembled),
          -vertical * 0.14,
          scattered,
        ),
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(startTurn, 0, assembled),
          endTurn,
          scattered,
        ),
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(direction * 0.18, 0, assembled),
          direction * 0.24,
          scattered,
        ),
      );

      const scale = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.72, 1, assembled),
        0.58,
        scattered,
      );
      letter.scale.setScalar(scale);
    });

    const damping = 1 - Math.exp(-4 * delta);
    pointerLean.current.x +=
      (pointer.current.y * 0.045 - pointerLean.current.x) * damping;
    pointerLean.current.y +=
      (pointer.current.x * 0.075 - pointerLean.current.y) * damping;
    group.rotation.x = pointerLean.current.x;
    group.rotation.y = pointerLean.current.y;
    group.position.y = Math.sin(clock.getElapsedTime() * 0.55) * 0.045;

    const codeIn = smoothstep(0.28, 0.43, p);
    const codeOut = smoothstep(0.67, 0.84, p);
    if (codeMaterial.current) {
      codeMaterial.current.opacity = reduced ? 0.72 : codeIn * (1 - codeOut);
    }

    const typing = reduced ? 1 : smoothstep(0.3, 0.64, p);
    const characters = Math.round(totalCharacters * typing);
    const cursor = Math.floor(clock.getElapsedTime() * 2) % 2 === 0;
    if (
      characters !== lastCodeFrame.current.characters ||
      cursor !== lastCodeFrame.current.cursor
    ) {
      redraw(characters, cursor);
      lastCodeFrame.current = { characters, cursor };
    }
  });

  return (
    <group ref={root}>
      <mesh position={[0, 0, -0.35]} scale={[1.04, 1, 1]}>
        <planeGeometry args={[7.5, 4.65]} />
        <meshBasicMaterial
          ref={codeMaterial}
          map={texture}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {WORD.map((letter, index) => (
        <group
          key={`${letter}-${index}`}
          ref={(node) => {
            letters.current[index] = node;
          }}
        >
          <Center>
            <Text3D
              font={FONT}
              size={0.82}
              height={0.18}
              curveSegments={8}
              bevelEnabled
              bevelSize={0.018}
              bevelThickness={0.025}
              bevelSegments={3}
            >
              {letter}
              <meshStandardMaterial
                color={index === 0 || index === 5 ? "#b8f300" : "#f5f5f0"}
                metalness={0.38}
                roughness={0.28}
              />
            </Text3D>
          </Center>
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
  const progress = useScrollProgress(sectionRef);
  const pointer = usePointer(rootRef);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Canvas
        camera={{ position: [0, 0.1, 10.2], fov: 32 }}
        dpr={compact ? [1, 1.35] : [1, 1.65]}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced ? "demand" : "always"}
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
            <KineticType
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
