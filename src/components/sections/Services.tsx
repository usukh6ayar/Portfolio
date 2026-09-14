"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { scrollToHash } from "@/components/providers/LenisProvider";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

type Offer = {
  index: string;
  title: string;
  detail: string;
};

/**
 * Services — the four engagements a client can actually buy, stated as
 * outcomes. Deliberately no tool names: those belong to Capabilities, and a
 * client is not shopping for a framework. Every claim here is traceable to one
 * of the two case studies.
 *
 * Laid out as cards rather than the Capabilities list, so that two sections of
 * four items do not read as the same section twice.
 */
export function Services() {
  const t = useTranslations("services");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const offers = t.raw("offers") as Offer[];

  useEffect(() => {
    if (!isReady || !rootRef.current || reduced) return;

    const root = rootRef.current;
    const parts = root.querySelectorAll<HTMLElement>("[data-services-reveal]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parts,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced]);

  return (
    <section
      id="services"
      ref={rootRef}
      className="relative z-0 scroll-mt-[var(--nav-height)] border-t border-border bg-background py-[var(--section-y)]"
      aria-labelledby="services-heading"
    >
      <div className="container-page">
        <div className="max-w-xl">
          <p
            data-services-reveal
            className={cn(
              "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted",
              !reduced && "opacity-0",
            )}
          >
            {t("label")}
          </p>
          <h2
            id="services-heading"
            data-services-reveal
            className={cn(
              "mt-3 font-display text-[clamp(1.85rem,3.8vw,3rem)] font-semibold tracking-[-0.035em] text-foreground",
              !reduced && "opacity-0",
            )}
          >
            {t("headline")}
          </h2>
          <p
            data-services-reveal
            className={cn(
              "mt-4 text-[var(--text-body-sm)] leading-relaxed text-muted sm:text-base",
              !reduced && "opacity-0",
            )}
          >
            {t("intro")}
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:mt-16 sm:grid-cols-2">
          {Array.isArray(offers) &&
            offers.map((offer) => (
              <li
                key={offer.index}
                data-services-reveal
                className={cn(
                  "flex flex-col bg-background p-7 sm:p-9",
                  !reduced && "opacity-0",
                )}
              >
                <span className="font-mono text-[0.7rem] tabular-nums tracking-wide text-accent">
                  {offer.index}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
                  {offer.title}
                </h3>
                <p className="mt-3 max-w-[34rem] text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                  {offer.detail}
                </p>
              </li>
            ))}
        </ul>

        <div
          data-services-reveal
          className={cn("mt-10 sm:mt-12", !reduced && "opacity-0")}
        >
          <MagneticButton
            href="#contact"
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              scrollToHash("#contact");
            }}
          >
            {t("cta")}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
