"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { TextLink } from "@/components/ui/TextLink";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { SOCIAL_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger);

/**
 * Contact — final editorial chapter.
 * The pitch, an inquiry form, and the integrated footer.
 * Isolated polish: does not edit Hero / About / other sections.
 */
export function Contact() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const tSocial = useTranslations("social");
  const { isReady } = useApp();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!isReady || !rootRef.current) return;

    const root = rootRef.current;
    const lines = root.querySelectorAll<HTMLElement>("[data-contact-line]");
    const body = root.querySelectorAll<HTMLElement>("[data-contact-body]");
    const cta = root.querySelector<HTMLElement>("[data-contact-cta]");
    const foot = root.querySelectorAll<HTMLElement>("[data-contact-foot]");

    if (reduced) {
      gsap.set([lines, body, cta, foot].filter(Boolean), {
        opacity: 1,
        y: 0,
        clearProps: "clipPath,transform",
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Start early so the chapter peeks before Skills fully leaves
      gsap.fromTo(
        lines,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        body,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        },
      );

      if (cta) {
        gsap.fromTo(
          cta,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cta,
              start: "top 90%",
              once: true,
            },
          },
        );
      }

      gsap.fromTo(
        foot,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.querySelector("[data-contact-footer]"),
            start: "top 94%",
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
      className="relative z-0 flex flex-col scroll-mt-[var(--nav-height)] bg-background"
      aria-labelledby="contact-heading"
    >
      {/* Main closing scene — the pitch on the left, the way to answer it on
          the right. The path used to end at a mailto:, which asked a visitor
          to compose the email themselves. */}
      <div className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="flex flex-col">
          <p
            data-contact-body
            className={cn(
              "font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted",
              !reduced && "opacity-0",
            )}
          >
            {t("label")}
          </p>

          <h2
            id="contact-heading"
            className="mt-5 max-w-[14ch] font-display text-[clamp(2.75rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-foreground sm:mt-6"
          >
            <span className="block overflow-hidden pb-[0.04em]">
              <span
                data-contact-line
                className={cn("block", !reduced && "opacity-0")}
              >
                {t("headline.line1")}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <span
                data-contact-line
                className={cn("block", !reduced && "opacity-0")}
              >
                {t("headline.line2Before")}
                <span className="text-accent">{t("headline.accent")}</span>
                {t("headline.line2After")}
              </span>
            </span>
          </h2>

          <p
            data-contact-body
            className={cn(
              "mt-7 max-w-[28rem] text-[0.975rem] leading-[1.7] text-muted sm:mt-8 sm:text-base",
              !reduced && "opacity-0",
            )}
          >
            {t("body")}
          </p>

          {/* For the people who will not fill in a form, and there are some. */}
          <p
            data-contact-body
            className={cn(
              "mt-10 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted sm:mt-12",
              !reduced && "opacity-0",
            )}
          >
            {t("form.orEmail")}
          </p>

          <ul
            data-contact-body
            className={cn(
              "mt-4 flex flex-wrap items-center gap-x-8 gap-y-3",
              !reduced && "opacity-0",
            )}
          >
            {SOCIAL_ITEMS.map((item) => (
              <li key={item.key}>
                <TextLink
                  href={item.href}
                  external={item.external}
                  arrow={item.key === "email"}
                  className="text-[0.9375rem]"
                >
                  {tSocial(item.key)}
                </TextLink>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-contact-cta
          className={cn("lg:pt-2", !reduced && "opacity-0")}
        >
          <InquiryForm />
        </div>
      </div>

      {/* Integrated footer — same chapter, not a separate site block */}
      <footer
        data-contact-footer
        className="mt-auto border-t border-border"
      >
        <div className="container-page py-8 sm:py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
            <div
              data-contact-foot
              className={cn("lg:col-span-4", !reduced && "opacity-0")}
            >
              <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                {tCommon("name")}
              </p>
              <p className="mt-1 text-sm text-muted">{t("role")}</p>
            </div>

            <div
              data-contact-foot
              className={cn("lg:col-span-3", !reduced && "opacity-0")}
            >
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                {t("footerConnect")}
              </p>
              <ul className="mt-3 space-y-2">
                {SOCIAL_ITEMS.map((item) => (
                  <li key={`foot-${item.key}`}>
                    <TextLink
                      href={item.href}
                      external={item.external}
                      className="text-sm"
                    >
                      {tSocial(item.key)}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-contact-foot
              className={cn("lg:col-span-3", !reduced && "opacity-0")}
            >
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                {t("footerLocation")}
              </p>
              <p className="mt-3 text-sm text-foreground/85">
                {tCommon("location")}
              </p>
              <LocalTimeLabel className="mt-2" />
            </div>

            <div
              data-contact-foot
              className={cn(
                "flex flex-col items-start gap-4 sm:items-end lg:col-span-2",
                !reduced && "opacity-0",
              )}
            >
              <LanguageSwitcher />
              <p className="font-mono text-[0.625rem] tabular-nums tracking-wide text-muted">
                © {year}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}

function LocalTimeLabel({ className }: { className?: string }) {
  const t = useTranslations("contact");
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

  if (!localTime) return null;

  return (
    <p
      className={cn(
        "font-mono text-[0.65rem] tabular-nums tracking-wide text-muted",
        className,
      )}
    >
      {t("localTime")} {localTime}
    </p>
  );
}
