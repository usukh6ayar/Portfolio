"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextLink } from "@/components/ui/TextLink";
import { SITE, SOCIAL_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/**
 * Contact — large CTA, calm product close.
 * Local time in Ulaanbaatar.
 */
export function Contact() {
  const t = useTranslations("contact");
  const tSocial = useTranslations("social");
  const tFooter = useTranslations("footer");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const format = () => {
      try {
        setLocalTime(
          new Intl.DateTimeFormat(undefined, {
            timeZone: "Asia/Ulaanbaatar",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        setLocalTime("");
      }
    };
    format();
    const id = window.setInterval(format, 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isReady || !rootRef.current || reduced) return;

    const root = rootRef.current;
    const parts = root.querySelectorAll<HTMLElement>("[data-contact-reveal]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parts,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [isReady, reduced]);

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative z-0 scroll-mt-[var(--nav-height)] bg-background"
      aria-labelledby="contact-heading"
    >
      <div className="container-page pb-[var(--section-y)] pt-2 sm:pt-4">
        {/* Chapter title lives in SectionBridge for continuous handoff */}
        <h2 id="contact-heading" className="sr-only">
          {t("headline")}
        </h2>

        <p
          data-contact-reveal
          className={cn(
            "max-w-[32rem] text-base leading-relaxed text-muted sm:text-lg",
            !reduced && "opacity-0",
          )}
        >
          {t("body")}
        </p>

        <div
          data-contact-reveal
          className={cn(
            "mt-10 flex flex-wrap items-center gap-4",
            !reduced && "opacity-0",
          )}
        >
          <MagneticButton href={`mailto:${SITE.email}`} variant="primary">
            {t("ctaEmail")}
          </MagneticButton>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-accent opacity-50 animate-ping motion-reduce:animate-none" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {t("ctaAvailability")}
          </span>
        </div>

        <div
          data-contact-reveal
          className={cn(
            "mt-14 flex flex-col gap-8 border-t border-border pt-10 sm:mt-16 sm:flex-row sm:items-end sm:justify-between",
            !reduced && "opacity-0",
          )}
        >
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {SOCIAL_ITEMS.map((item) => (
              <li key={item.key}>
                <TextLink
                  href={item.href}
                  external={item.external}
                  arrow={item.key === "email"}
                >
                  {tSocial(item.key)}
                </TextLink>
              </li>
            ))}
          </ul>

          <div className="text-left sm:text-right">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
              {t("localTime")}
              {localTime ? (
                <span className="ml-2 tabular-nums text-foreground/80">
                  {localTime}
                </span>
              ) : null}
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted sm:ml-auto">
              {t("footnote")}
            </p>
          </div>
        </div>

        <p
          data-contact-reveal
          className={cn(
            "mt-16 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted/70",
            !reduced && "opacity-0",
          )}
        >
          {tFooter("rights")}
        </p>
      </div>
    </section>
  );
}
