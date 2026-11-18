"use client";

import { useTranslations } from "next-intl";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { CASE_STUDY_EXTRAS, MAX_RESULTS } from "@/lib/case-study";
import type { ProjectId } from "@/lib/projects";
import { cn } from "@/lib/cn";

/**
 * Results row: up to three real numbers. Renders nothing until there is data —
 * an empty proof block reads worse than no block.
 */
export function ResultsRow({
  id,
  compact = false,
  className,
}: {
  id: ProjectId;
  /** The home-page card: smaller numbers, no heading */
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations("work.proof");
  const { locale } = useLocaleSwitch();
  const results = CASE_STUDY_EXTRAS[id].results.slice(0, MAX_RESULTS);
  if (results.length === 0) return null;

  return (
    <div className={className}>
      {!compact && (
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
          {t("results")}
        </p>
      )}
      <dl
        aria-label={compact ? t("results") : undefined}
        className={cn(
          "grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border",
          !compact && "mt-4",
        )}
      >
        {results.map((metric) => (
          <div key={metric.label.en} className="flex flex-col-reverse gap-1.5 bg-background p-4 sm:p-5">
            <dt className="text-[0.75rem] leading-snug text-muted sm:text-[0.8125rem]">
              {metric.label[locale]}
            </dt>
            <dd
              className={cn(
                "font-display font-semibold tabular-nums tracking-[-0.03em] text-accent",
                compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-[2rem]",
              )}
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** A client's own words. Hidden until a real, attributable quote exists. */
export function TestimonialBlock({
  id,
  compact = false,
  className,
}: {
  id: ProjectId;
  compact?: boolean;
  className?: string;
}) {
  const t = useTranslations("work.proof");
  const { locale } = useLocaleSwitch();
  const quote = CASE_STUDY_EXTRAS[id].testimonial;
  if (!quote || !quote.quote[locale].trim() || !quote.name.trim()) return null;

  return (
    <figure className={cn("border-l-2 border-accent pl-5", className)}>
      <span className="sr-only">{t("testimonial")}</span>
      <blockquote
        className={cn(
          "text-foreground/90",
          compact ? "text-[0.9375rem] leading-[1.7]" : "font-display text-xl leading-[1.45] tracking-[-0.015em] sm:text-2xl",
        )}
      >
        <p>“{quote.quote[locale]}”</p>
      </blockquote>
      <figcaption className="mt-4 text-sm text-muted">
        <span className="text-foreground">{quote.name}</span>
        {[quote.role[locale], quote.organization].filter(Boolean).map((part) => (
          <span key={part}> · {part}</span>
        ))}
      </figcaption>
    </figure>
  );
}
