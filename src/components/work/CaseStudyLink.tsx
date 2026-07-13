"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

type CaseStudyLinkProps = {
  href: string;
  className?: string;
};

/**
 * Calm CTA link — underline expands, arrow nudges.
 * Native cursor.
 */
export function CaseStudyLink({ href, className }: CaseStudyLinkProps) {
  const t = useTranslations("work");

  return (
    <Link
      href={href}
      className={cn(
        "group/cta inline-flex items-center gap-2",
        "text-sm font-medium tracking-tight text-foreground",
        "transition-colors duration-300 hover:text-accent",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        className,
      )}
    >
      <span className="link-underline">{t("viewCaseStudy")}</span>
      <span
        aria-hidden
        className="translate-x-0 text-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-[3px]"
      >
        →
      </span>
    </Link>
  );
}
