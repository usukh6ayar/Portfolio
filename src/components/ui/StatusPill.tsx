"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

type StatusPillProps = {
  className?: string;
  label?: string;
};

export function StatusPill({ className, label }: StatusPillProps) {
  const t = useTranslations("common");
  const text = label ?? t("availability");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full",
        "border border-border bg-surface-1/80 backdrop-blur-sm",
        "px-3 py-1.5 text-caption text-muted",
        className,
      )}
      role="status"
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className="absolute inset-0 rounded-full bg-accent opacity-60 animate-ping motion-reduce:animate-none" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-foreground/90">
        {text}
      </span>
    </span>
  );
}
