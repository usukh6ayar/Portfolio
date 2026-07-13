"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { scrollToHash } from "@/components/providers/LenisProvider";
import { StatusPill } from "@/components/ui/StatusPill";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NAV_ITEMS } from "@/lib/constants";
import { EASE } from "@/lib/easings";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Navigation() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { isReady, openCommand } = useApp();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    scrollToHash(href);
  };

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || mobileOpen
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
      initial={reduced ? false : { y: -16, opacity: 0 }}
      animate={
        isReady
          ? { y: 0, opacity: 1 }
          : reduced
            ? { opacity: 0 }
            : { y: -16, opacity: 0 }
      }
      transition={{ duration: 0.6, ease: EASE.outExpo, delay: reduced ? 0 : 0.05 }}
    >
      <nav
        className="container-page flex h-[var(--nav-height)] items-center justify-between gap-4"
        aria-label={t("primary")}
      >
        <a
          href="#top"
          className="group flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          onClick={(e) => {
            e.preventDefault();
            const lenis = (
              window as Window & { __lenis?: { scrollTo: (n: number) => void } }
            ).__lenis;
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: "smooth" });
            setMobileOpen(false);
          }}
        >
          <span className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
            {tCommon("name")}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.href);
                }}
                className="link-underline rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <StatusPill className="!py-1" />
          <LanguageSwitcher />
          <button
            type="button"
            onClick={openCommand}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border",
              "bg-surface-1 px-3 py-1.5 text-xs text-muted",
              "transition-colors hover:border-border-strong hover:text-foreground",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
            aria-label={t("openCommand")}
          >
            <span>{t("search")}</span>
            <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={openCommand}
            className="rounded-full border border-border px-2.5 py-1.5 font-mono text-[0.65rem] text-muted"
            aria-label={t("openCommand")}
          >
            ⌘K
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">{t("menu")}</span>
            <span className="relative block h-3.5 w-4" aria-hidden>
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300",
                  mobileOpen && "top-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-px w-full bg-current transition-opacity duration-200",
                  mobileOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-3 h-px w-full bg-current transition-transform duration-300",
                  mobileOpen && "top-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-300",
          mobileOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 border-transparent pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen ? true : undefined}
      >
        <ul className="container-page flex flex-col gap-1 py-4">
          {NAV_ITEMS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                tabIndex={mobileOpen ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.href);
                }}
                className="block rounded-lg px-2 py-3 font-display text-2xl tracking-tight text-foreground"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <StatusPill />
          </li>
        </ul>
      </div>
    </motion.header>
  );
}
