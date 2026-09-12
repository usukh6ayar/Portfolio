"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { scrollToHash } from "@/components/providers/LenisProvider";
import { NAV_ITEMS } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/settings";
import { EASE } from "@/lib/easings";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useApp } from "@/components/providers/AppProviders";

/**
 * Sticky nav — editorial, near-invisible.
 * Usukhbayar · About Work Capabilities Contact · ● Open  МН
 * Command palette: Cmd/Ctrl+K only (not shown in the bar).
 */
export function Navigation() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tLang = useTranslations("lang");
  const { isReady, openCommand } = useApp();
  const pathname = usePathname();
  const { locale, setLocale } = useLocaleSwitch();
  const reduced = useReducedMotion();
  // Always false on first render so SSR and client hydration match; the
  // effect below syncs the real scroll position immediately after mount.
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const currentHref = pathname === "/" ? activeHref : null;

  useEffect(() => {
    // Only re-render when the threshold is crossed — not every scroll frame
    let last = window.scrollY > 24;
    // Sync the actual scroll state post-hydration (e.g. reloaded while scrolled)
    const initialFrame = window.requestAnimationFrame(() => setScrolled(last));
    const onScroll = () => {
      const next = window.scrollY > 24;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = [
      { id: "top", href: "#top" },
      { id: "about", href: "#about" },
      { id: "featured", href: "#featured" },
      { id: "work", href: "#featured" },
      { id: "stack", href: "#stack" },
      { id: "contact", href: "#contact" },
    ]
      .map((item) => ({ ...item, element: document.getElementById(item.id) }))
      .filter((item) => item.element);

    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 320);
      let next = "#top";

      for (const section of sections) {
        if ((section.element?.offsetTop ?? Number.POSITIVE_INFINITY) <= marker) {
          next = section.href;
        }
      }

      setActiveHref((current) => (current === next ? current : next));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    if (pathname === "/") scrollToHash(href);
  };

  /** Show only the language you can switch *to* */
  const targetLocale: Locale = locale === "en" ? "mn" : "en";
  const targetLabel = targetLocale === "en" ? tLang("en") : tLang("mn");
  const targetFull = targetLocale === "en" ? tLang("enFull") : tLang("mnFull");

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || mobileOpen
          ? "border-b border-border/80 bg-background/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
      initial={reduced ? false : { y: -12, opacity: 0 }}
      animate={
        isReady
          ? { y: 0, opacity: 1 }
          : reduced
            ? { opacity: 0 }
            : { y: -12, opacity: 0 }
      }
      transition={{ duration: 0.55, ease: EASE.outExpo, delay: reduced ? 0 : 0.05 }}
    >
      <nav
        className="container-page grid h-[var(--nav-height)] grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]"
        aria-label={t("primary")}
      >
        {/* Brand */}
        <a
          href={pathname === "/" ? "#top" : "/"}
          className="justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          onClick={(e) => {
            if (pathname !== "/") return;
            e.preventDefault();
            const lenis = (
              window as Window & { __lenis?: { scrollTo: (n: number) => void } }
            ).__lenis;
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: "smooth" });
            setMobileOpen(false);
          }}
        >
          <span className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground transition-colors duration-300 hover:text-foreground/80">
            {tCommon("name")}
          </span>
        </a>

        {/* Center links — desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((link) => (
            <li key={link.href}>
              <a
                href={pathname === "/" ? link.href : `/${link.href}`}
                aria-current={currentHref === link.href ? "location" : undefined}
                onClick={(e) => {
                  if (pathname === "/") e.preventDefault();
                  handleNav(link.href);
                }}
                className={cn(
                  "relative rounded-sm px-3 py-1.5 text-[0.8125rem] transition-colors duration-300 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  currentHref === link.href ? "text-foreground" : "text-muted",
                )}
              >
                {t(link.key)}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300",
                    currentHref === link.href ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster — desktop: ● Open · МН */}
        <div className="hidden items-center justify-self-end gap-5 md:flex lg:gap-7">
          <AvailabilityDot label={t("statusOpen")} />
          <button
            type="button"
            onClick={openCommand}
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-muted transition-[color,border-color,background-color] duration-300 hover:border-border-strong hover:bg-surface-1 hover:text-foreground lg:inline-flex"
            aria-label={t("openCommand")}
          >
            <span className="text-[0.75rem]">{t("menu")}</span>
            <kbd className="font-mono text-[0.625rem] tracking-wide text-foreground/65">
              ⌘K
            </kbd>
          </button>
          <LangToggle
            label={targetLabel}
            fullName={targetFull}
            switcherLabel={tLang("switcher")}
            onClick={() => setLocale(targetLocale)}
          />
        </div>

        {/* Mobile controls — no ⌘K chrome */}
        <div className="flex items-center justify-self-end gap-4 md:hidden">
          <LangToggle
            label={targetLabel}
            fullName={targetFull}
            switcherLabel={tLang("switcher")}
            onClick={() => setLocale(targetLocale)}
          />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-foreground"
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
        <ul className="container-page flex flex-col gap-0.5 py-4">
          {NAV_ITEMS.map((link) => (
            <li key={link.href}>
              <a
                href={pathname === "/" ? link.href : `/${link.href}`}
                aria-current={currentHref === link.href ? "location" : undefined}
                tabIndex={mobileOpen ? 0 : -1}
                onClick={(e) => {
                  if (pathname === "/") e.preventDefault();
                  handleNav(link.href);
                }}
                className={cn(
                  "flex items-center justify-between rounded-lg px-1 py-3 font-display text-2xl tracking-tight",
                  currentHref === link.href ? "text-accent" : "text-foreground",
                )}
              >
                {t(link.key)}
                {currentHref === link.href && (
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </a>
            </li>
          ))}
          <li className="mt-2 flex items-center justify-between border-t border-border pt-4">
            <button
              type="button"
              tabIndex={mobileOpen ? 0 : -1}
              onClick={() => {
                setMobileOpen(false);
                openCommand();
              }}
              className="inline-flex items-center gap-2 text-sm text-foreground"
            >
              <span>{t("openCommand")}</span>
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.625rem] text-muted">
                ⌘K
              </kbd>
            </button>
            <AvailabilityDot label={t("statusOpen")} />
          </li>
        </ul>
      </div>
    </motion.header>
  );
}

function AvailabilityDot({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5" role="status">
      <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
        <span className="absolute inset-0 rounded-full bg-accent/50 animate-ping motion-reduce:animate-none" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
        {label}
      </span>
    </span>
  );
}

/**
 * Single “switch to” label (EN or МН).
 * Same type system as nav links (Inter / font-sans, regular weight) —
 * slightly smaller only; no mono.
 */
function LangToggle({
  label,
  fullName,
  switcherLabel,
  onClick,
}: {
  label: string;
  fullName: string;
  switcherLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${switcherLabel}: ${fullName}`}
      className={cn(
        /* Match About / Work / Capabilities / Contact: sans, regular weight */
        "inline-flex items-center justify-center",
        "min-w-[1.75rem]",
        "font-sans text-[0.75rem] font-normal leading-none tracking-normal",
        "text-muted transition-colors duration-300 hover:text-foreground",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
      )}
    >
      <span className="inline-block min-w-[1.35em] text-center">{label}</span>
    </button>
  );
}
