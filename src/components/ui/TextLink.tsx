"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  /** Show trailing arrow that nudges on hover */
  arrow?: boolean;
};

/**
 * Calm text link — underline expands, optional arrow slides.
 * Native cursor only.
 */
export function TextLink({
  href,
  children,
  className,
  external = false,
  arrow = false,
}: TextLinkProps) {
  const shared = cn(
    "group/link inline-flex items-center gap-1.5",
    "text-sm text-foreground/85 transition-colors duration-300 hover:text-accent",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
    className,
  );

  const inner = (
    <>
      <span className="link-underline">{children}</span>
      {arrow && (
        <span
          aria-hidden
          className="translate-x-0 text-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-0.5"
        >
          →
        </span>
      )}
    </>
  );

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={shared}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={shared}>
      {inner}
    </Link>
  );
}
