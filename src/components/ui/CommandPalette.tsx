"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { scrollToHash } from "@/components/providers/LenisProvider";
import { NAV_ITEMS, SITE, SOCIAL_ITEMS } from "@/lib/constants";
import { EASE } from "@/lib/easings";
import { cn } from "@/lib/cn";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  action: () => void;
};

function openMailto(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function CommandPalette() {
  const t = useTranslations("command");
  const tNav = useTranslations("nav");
  const tSocial = useTranslations("social");
  const tCommon = useTranslations("common");
  const { isCommandOpen, closeCommand } = useApp();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const wasOpen = useRef(false);

  const items = useMemo<CommandItem[]>(() => {
    const navGroup = t("groupNavigate");
    const connectGroup = t("groupConnect");

    const nav: CommandItem[] = NAV_ITEMS.map((link) => ({
      id: `nav-${link.href}`,
      label: tNav(link.key),
      hint: link.href,
      group: navGroup,
      action: () => {
        scrollToHash(link.href);
        closeCommand();
      },
    }));

    const social: CommandItem[] = SOCIAL_ITEMS.map((s) => ({
      id: `social-${s.key}`,
      label: tSocial(s.key),
      hint: s.external ? t("external") : undefined,
      group: connectGroup,
      action: () => {
        if (s.href.startsWith("mailto:")) {
          openMailto(s.href);
        } else {
          window.open(s.href, "_blank", "noopener,noreferrer");
        }
        closeCommand();
      },
    }));

    const meta: CommandItem[] = [
      {
        id: "home",
        label: t("backToTop"),
        hint: t("home"),
        group: navGroup,
        action: () => {
          const lenis = (
            window as Window & {
              __lenis?: { scrollTo: (n: number) => void };
            }
          ).__lenis;
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
          closeCommand();
        },
      },
      {
        id: "email",
        label: t("email", { name: SITE.name }),
        hint: SITE.email,
        group: connectGroup,
        action: () => {
          openMailto(`mailto:${SITE.email}`);
          closeCommand();
        },
      },
    ];

    return [...meta, ...nav, ...social];
  }, [closeCommand, t, tNav, tSocial]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint?.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q),
    );
  }, [items, query]);

  const safeActive =
    filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1);

  useEffect(() => {
    if (isCommandOpen && !wasOpen.current) {
      wasOpen.current = true;
      const timer = window.setTimeout(() => {
        setQuery("");
        setActive(0);
        inputRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(timer);
    }
    if (!isCommandOpen) {
      wasOpen.current = false;
    }
  }, [isCommandOpen]);

  useEffect(() => {
    if (!isCommandOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (
      window as Window & {
        __lenis?: { stop: () => void; start: () => void };
      }
    ).__lenis;
    lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [isCommandOpen]);

  const run = (item: CommandItem) => item.action();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[safeActive]) {
      e.preventDefault();
      run(filtered[safeActive]);
    }
  };

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    return map;
  }, [filtered]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isCommandOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE.outExpo }}
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px]"
            aria-label={t("close")}
            onClick={closeCommand}
          />

          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-surface-1 shadow-2xl shadow-black/50"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE.outExpo }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <span className="text-caption text-muted" aria-hidden>
                ⌘
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={t("placeholder")}
                className="w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted"
                aria-autocomplete="list"
                aria-controls={listId}
              />
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[0.65rem] text-muted sm:inline-flex">
                ESC
              </kbd>
            </div>

            <ul
              id={listId}
              role="listbox"
              className="max-h-[min(50vh,22rem)] overflow-y-auto p-2"
            >
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted">
                  {t("noMatches")}
                </li>
              )}

              {Array.from(groups.entries()).map(([group, groupItems]) => (
                <li key={group} className="mb-1">
                  <p className="px-3 py-2 text-caption text-muted">{group}</p>
                  <ul>
                    {groupItems.map((item) => {
                      flatIndex += 1;
                      const index = flatIndex;
                      const isActive = index === safeActive;
                      return (
                        <li key={item.id} role="option" aria-selected={isActive}>
                          <button
                            type="button"
                            onClick={() => run(item)}
                            onMouseEnter={() => setActive(index)}
                            className={cn(
                              "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                              isActive
                                ? "bg-surface-2 text-foreground"
                                : "text-foreground/80 hover:bg-surface-2/60",
                            )}
                          >
                            <span>{item.label}</span>
                            {item.hint && (
                              <span className="truncate text-caption normal-case tracking-normal text-muted">
                                {item.hint}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-caption normal-case tracking-normal text-muted">
              <span>{t("hint")}</span>
              <span className="text-accent/80">{tCommon("availability")}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
