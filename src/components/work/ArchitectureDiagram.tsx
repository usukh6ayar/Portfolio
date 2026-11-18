"use client";

import { Fragment } from "react";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import type { Architecture } from "@/lib/case-study";
import { cn } from "@/lib/cn";

/**
 * A plain box-and-arrow diagram in HTML/CSS: tiers top to bottom, an arrow
 * between each. On phones every box takes the full width; from sm up a tier
 * spreads across. Text stays real text, so it reads, wraps and translates.
 */
export function ArchitectureDiagram({
  tiers,
  label,
}: {
  tiers: Architecture;
  label: string;
}) {
  const { locale } = useLocaleSwitch();

  return (
    <figure
      aria-label={label}
      className="rounded-xl border border-border bg-surface-1 p-4 sm:p-7"
    >
      <div className="flex flex-col items-stretch">
        {tiers.map((tier, t) => (
          <Fragment key={t}>
            {t > 0 && <Arrow />}
            <ul
              className={cn(
                "grid gap-3",
                tier.length > 1 && "sm:grid-cols-2",
                tier.length === 3 && "lg:grid-cols-3",
                tier.length >= 4 && "lg:grid-cols-4",
                tier.length === 1 && "mx-auto w-full sm:max-w-sm",
              )}
            >
              {tier.map((node) => (
                <li key={node.label} className="flex flex-col">
                  <div
                    className={cn(
                      "flex h-full flex-col justify-center rounded-lg border px-4 py-3 text-center",
                      t === 1 && tiers.length > 2
                        ? "border-accent/50 bg-accent/[0.06]"
                        : "border-border-strong bg-background",
                    )}
                  >
                    <span className="font-mono text-[0.8125rem] font-medium text-foreground">
                      {node.label}
                    </span>
                    {node.note && (
                      <span className="mt-1 text-[0.75rem] leading-snug text-muted">
                        {node.note[locale]}
                      </span>
                    )}
                  </div>
                  {node.feeds && (
                    <>
                      <Arrow small />
                      <div className="rounded-lg border border-dashed border-border-strong px-4 py-2.5 text-center font-mono text-[0.75rem] text-muted">
                        {node.feeds}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    </figure>
  );
}

function Arrow({ small = false }: { small?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative mx-auto block w-px bg-border-strong",
        small ? "h-4" : "h-7",
        "after:absolute after:-bottom-px after:left-1/2 after:-translate-x-1/2 after:border-x-[4px] after:border-t-[5px] after:border-x-transparent after:border-t-border-strong after:content-['']",
      )}
    />
  );
}
