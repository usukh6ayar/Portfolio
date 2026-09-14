"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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

/**
 * Pointer position over the element, in -1..1 on each axis. Null until the
 * pointer has actually been somewhere — a touch device never reports, and the
 * scene should not sit at a hard zero waiting for it.
 */
function usePointer(root: React.RefObject<HTMLElement | null>) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const read = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      pointer.current.x = THREE.MathUtils.clamp(((event.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp(((event.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    };
    // On window, not the canvas: the parallax should answer to the whole
    // section the visual sits in, not only the pixels it covers.
    window.addEventListener("pointermove", read, { passive: true });
    return () => window.removeEventListener("pointermove", read);
  }, [root]);

  return pointer;
}

const CORE = "#3d4552";
const CORE_EDGE = "#b8f300";
const SHELL_EDGE = "#6b7686";
const NODE = "#333a46";
const LINK = "#6b7686";

type Node = {
  position: THREE.Vector3;
  /** Radius of the node's own slow orbit around its resting point. */
  drift: number;
  phase: number;
  size: number;
  /** The few that carry the accent — the rest stay grey. */
  lit: boolean;
};

/**
 * Nodes on two shells around the centre, placed on a Fibonacci sphere so they
 * distribute evenly without clumping, then pulled off it slightly so the
 * arrangement reads as designed rather than generated.
 */
function buildNodes(count: number): Node[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    // Two shells, alternating, so the field has depth rather than a single skin.
    const shell = i % 3 === 0 ? 2.75 : 2.1;
    return {
      position: new THREE.Vector3(
        Math.cos(theta) * radius * shell,
        y * shell * 0.72,
        Math.sin(theta) * radius * shell,
      ),
      drift: 0.05 + (i % 4) * 0.02,
      phase: i * 1.7,
      size: i % 5 === 0 ? 0.085 : 0.055,
      lit: i % 7 === 0,
    };
  });
}

/**
 * The centre, and everything wired to it.
 *
 * An octahedron core inside a larger wireframe shell, nodes distributed around
 * both, and a line from the core out to every node with a few node-to-node
 * links across the field. It turns slowly on its own and leans a little toward
 * the pointer; scrolling opens the field outward.
 */
function System({
  progress,
  pointer,
  nodeCount,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  nodeCount: number;
}) {
  const group = useRef<THREE.Group>(null);
  const field = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const eased = useRef(0);
  const lean = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => buildNodes(nodeCount), [nodeCount]);

  /**
   * Spokes from the centre, plus a chord between every node and the one three
   * along — enough cross-linking to read as a network, far short of a mesh.
   */
  const links = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (const [i, node] of nodes.entries()) {
      points.push(new THREE.Vector3(0, 0, 0), node.position.clone());
      const across = nodes[(i + 3) % nodes.length];
      if (i % 2 === 0) points.push(node.position.clone(), across.position.clone());
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  useEffect(() => () => links.dispose(), [links]);

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;

    const p = progress.current ?? 0;
    eased.current += (p - eased.current) * (1 - Math.exp(-4 * delta));
    const s = eased.current;
    const t = clock.getElapsedTime();

    // Pointer lean is damped hard and clamped small: it should register as
    // depth, not as a thing being dragged around.
    const target = pointer.current ?? { x: 0, y: 0 };
    const k = 1 - Math.exp(-2.6 * delta);
    lean.current.x += (target.y * 0.14 - lean.current.x) * k;
    lean.current.y += (target.x * 0.22 - lean.current.y) * k;

    g.rotation.x = lean.current.x + Math.sin(t * 0.21) * 0.03 - 0.06;
    g.rotation.y = lean.current.y + t * 0.045;
    g.position.y = (0.5 - s) * 0.22;

    // The field opens as the section passes, and the whole thing eases closer.
    if (field.current) {
      const spread = 1 + s * 0.14;
      field.current.scale.setScalar(spread);
    }

    if (core.current) {
      core.current.rotation.y = -t * 0.13;
      core.current.rotation.z = Math.sin(t * 0.24) * 0.06;
    }
    if (shell.current) {
      shell.current.rotation.y = t * 0.08;
      shell.current.rotation.x = Math.cos(t * 0.17) * 0.05;
    }

    for (const [i, mesh] of nodeRefs.current.entries()) {
      const node = nodes[i];
      if (!mesh || !node) continue;
      // Each node breathes on its own phase along its own resting direction.
      const wobble = Math.sin(t * 0.55 + node.phase) * node.drift;
      mesh.position.copy(node.position).multiplyScalar(1 + wobble * 0.12);
      mesh.position.y += Math.sin(t * 0.4 + node.phase) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <group ref={field}>
        {/* Wireframe only: the shell is the idea of an enclosure, not a solid. */}
        <mesh ref={shell}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial wireframe color={SHELL_EDGE} transparent opacity={0.14} />
        </mesh>

        <group ref={core}>
          <mesh>
            <octahedronGeometry args={[0.78, 0]} />
            <meshStandardMaterial color={CORE} roughness={0.42} metalness={0.35} />
            <Edges threshold={15} color={CORE_EDGE} lineWidth={1.4} />
          </mesh>
        </group>

        <lineSegments geometry={links}>
          <lineBasicMaterial color={LINK} transparent opacity={0.2} />
        </lineSegments>

        {nodes.map((node, i) => (
          <mesh
            key={i}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            position={node.position}
          >
            <icosahedronGeometry args={[node.size, 0]} />
            <meshStandardMaterial
              color={NODE}
              roughness={0.35}
              metalness={0.4}
              emissive={node.lit ? CORE_EDGE : "#000000"}
              emissiveIntensity={node.lit ? 0.55 : 0}
            />
            <Edges threshold={15} color={node.lit ? CORE_EDGE : SHELL_EDGE} lineWidth={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * The About section's object — a system and the things wired to it, built from
 * primitives so it carries the site's own palette and costs no downloaded
 * asset. The pointer leans it; scroll opens the field. Frozen flat under
 * reduced motion, and thinned out on small screens.
 */
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
        camera={{ position: [0, 0, 7.4], fov: 34 }}
        dpr={compact ? [1, 1.5] : [1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        frameloop={reduced ? "demand" : "always"}
        aria-label={t("objectAlt")}
      >
        <ambientLight intensity={1.15} />
        {/* Key from the top right, acid bounce from below left, violet fill. */}
        <directionalLight position={[3.5, 5, 3]} intensity={2.9} color="#ffffff" />
        <directionalLight position={[-3.5, -2, 1.5]} intensity={1.9} color="#b8f300" />
        <directionalLight position={[-2, 3, -3]} intensity={1.3} color="#a78bfa" />
        <System progress={progress} pointer={pointer} nodeCount={compact ? 10 : 17} />
      </Canvas>
    </div>
  );
}
