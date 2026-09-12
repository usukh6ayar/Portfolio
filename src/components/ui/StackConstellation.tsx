"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

/**
 * The stack as a constellation: every tool is a star, every line a place two
 * of them actually meet in the work. Hovering a star names it and lights the
 * paths it sits on; everything else recedes.
 *
 * Plain SVG on purpose — this sits in the sticky rail of a long page, and a
 * WebGL context for seven dots would be a poor trade.
 */
type Node = {
  id: string;
  label: string;
  /** Percentage coordinates inside the square. */
  x: number;
  y: number;
  /** Where it sits in the product: shapes the caption. */
  role: "mobile" | "web" | "api" | "data";
};

const NODES: Node[] = [
  { id: "expo", label: "Expo", x: 17, y: 30, role: "mobile" },
  { id: "rn", label: "React Native", x: 34, y: 19, role: "mobile" },
  { id: "ts", label: "TypeScript", x: 57, y: 12, role: "web" },
  { id: "next", label: "Next.js", x: 79, y: 27, role: "web" },
  { id: "nest", label: "NestJS", x: 54, y: 48, role: "api" },
  { id: "redis", label: "Redis", x: 27, y: 68, role: "data" },
  { id: "postgres", label: "PostgreSQL", x: 74, y: 74, role: "data" },
];

const EDGES: [string, string][] = [
  ["expo", "rn"],
  ["rn", "ts"],
  ["ts", "next"],
  ["rn", "nest"],
  ["next", "nest"],
  ["nest", "postgres"],
  ["nest", "redis"],
];

const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function StackConstellation({ className }: { className?: string }) {
  const t = useTranslations("about.stackMap");
  const [active, setActive] = useState<string | null>(null);

  const connected = (id: string) =>
    EDGES.some(([a, b]) => (a === id && b === active) || (b === id && a === active));

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        role="img"
        aria-label={t("alt")}
      >
        {EDGES.map(([a, b]) => {
          const lit = active === a || active === b;
          return (
            <line
              key={`${a}-${b}`}
              x1={BY_ID[a].x}
              y1={BY_ID[a].y}
              x2={BY_ID[b].x}
              y2={BY_ID[b].y}
              stroke={lit ? "#b8f300" : "#f5f5f0"}
              strokeWidth={lit ? 0.5 : 0.28}
              strokeOpacity={lit ? 0.75 : active ? 0.08 : 0.18}
              className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          );
        })}

        {NODES.map((node, i) => {
          const isActive = active === node.id;
          const near = isActive || connected(node.id);
          return (
            <g
              key={node.id}
              className="cursor-none"
              onPointerEnter={() => setActive(node.id)}
              onPointerLeave={() => setActive((id) => (id === node.id ? null : id))}
            >
              {/* Generous hit area — the visible star stays small. */}
              <circle cx={node.x} cy={node.y} r={9} fill="transparent" />
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? 4.6 : 3.2}
                fill="#b8f300"
                fillOpacity={isActive ? 0.16 : 0}
                className="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? 1.7 : 1.15}
                fill={near ? "#b8f300" : "#f5f5f0"}
                fillOpacity={near ? 1 : active ? 0.28 : 0.7}
                className={cn(
                  "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  !active && "motion-safe:animate-[stack-drift_7s_ease-in-out_infinite]",
                )}
                style={{ animationDelay: `${i * 0.6}s` }}
              />
            </g>
          );
        })}
      </svg>

      {/* Keyboard path: the stars are decorative, the list is the real control. */}
      <ul className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-3 gap-y-1 p-4 sm:p-5">
        {NODES.map((node) => (
          <li key={node.id}>
            <button
              type="button"
              onFocus={() => setActive(node.id)}
              onBlur={() => setActive((id) => (id === node.id ? null : id))}
              onPointerEnter={() => setActive(node.id)}
              onPointerLeave={() => setActive((id) => (id === node.id ? null : id))}
              className={cn(
                "font-mono text-[0.5625rem] uppercase tracking-[0.14em] transition-colors duration-300",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                active === node.id ? "text-accent" : "text-muted/60 hover:text-muted",
              )}
            >
              {node.label}
            </button>
          </li>
        ))}
      </ul>

      <p
        aria-live="polite"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 p-4 font-mono text-[0.625rem] uppercase tracking-[0.16em] sm:p-5",
          "transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-foreground">{active ? BY_ID[active].label : ""}</span>
        <span className="text-muted">
          {active ? ` — ${t(BY_ID[active].role)}` : ""}
        </span>
      </p>
    </div>
  );
}
