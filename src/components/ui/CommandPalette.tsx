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
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useApp } from "@/components/providers/AppProviders";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { scrollToHash } from "@/components/providers/LenisProvider";
import { SITE, SOCIAL_ITEMS } from "@/lib/constants";
import { ALL_PROJECT_IDS, PROJECTS } from "@/lib/projects";
import { EASE } from "@/lib/easings";
import { cn } from "@/lib/cn";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  action: () => void;
};

function openExternal(href: string) {
  window.open(href, "_blank", "noopener,noreferrer");
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const el = document.createElement("textarea");
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  }
}

export function CommandPalette() {
  const t = useTranslations("command");
  const tCommon = useTranslations("common");
  const { isCommandOpen, closeCommand } = useApp();
  const { locale, setLocale } = useLocaleSwitch();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const listId = useId();
  const wasOpen = useRef(false);

  const items = useMemo<CommandItem[]>(() => {
    const navigate = t("groupNavigate");
    const projects = t("groupProjects");
    const actions = t("groupActions");

    const go = (hash: string) => {
      if (pathname === "/") scrollToHash(hash);
      else window.location.assign(`/${hash}`);
      closeCommand();
    };

    return [
      // Navigate — in page order, and the only place every section is listed:
      // the nav bar carries five of these, this carries all of them.
      {
        id: "nav-featured",
        label: t("featured"),
        hint: "#featured",
        group: navigate,
        action: () => go("#featured"),
      },
      {
        id: "nav-work",
        label: t("work"),
        hint: "#work",
        group: navigate,
        action: () => go("#work"),
      },
      {
        id: "nav-experience",
        label: t("experience"),
        hint: "#experience",
        group: navigate,
        action: () => go("#experience"),
      },
      {
        id: "nav-services",
        label: t("services"),
        hint: "#services",
        group: navigate,
        action: () => go("#services"),
      },
      {
        id: "nav-process",
        label: t("process"),
        hint: "#process",
        group: navigate,
        action: () => go("#process"),
      },
      {
        id: "nav-about",
        label: t("about"),
        hint: "#about",
        group: navigate,
        action: () => go("#about"),
      },
      {
        id: "nav-stack",
        label: t("stack"),
        hint: "#stack",
        group: navigate,
        action: () => go("#stack"),
      },
      {
        id: "nav-contact",
        label: t("contact"),
        hint: "#contact",
        group: navigate,
        action: () => go("#contact"),
      },
      // Projects — one entry per registered project, label from command.<id>
      ...ALL_PROJECT_IDS.map((id) => ({
        id: `proj-${id}`,
        label: t(id),
        hint: PROJECTS[id].href,
        group: projects,
        action: () => {
          window.location.href = PROJECTS[id].href;
          closeCommand();
        },
      })),
      // Actions
      {
        id: "act-copy-email",
        label: copied ? t("emailCopied") : t("copyEmail"),
        hint: SITE.email,
        group: actions,
        action: () => {
          void copyText(SITE.email).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          });
        },
      },
      // Social hrefs live in SITE config — keep them out of this file
      ...SOCIAL_ITEMS.filter((item) => item.key === "github").map((item) => ({
        id: `act-${item.key}`,
        label: t("openGitHub"),
        hint: item.href.replace(/^https?:\/\//, ""),
        group: actions,
        action: () => {
          openExternal(item.href);
          closeCommand();
        },
      })),
      {
        id: "act-lang",
        label: t("switchLanguage"),
        hint: locale === "en" ? "EN → МН" : "МН → EN",
        group: actions,
        action: () => {
          setLocale(locale === "en" ? "mn" : "en");
          closeCommand();
        },
      },
    ];
  }, [closeCommand, t, locale, setLocale, copied, pathname]);

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
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      wasOpen.current = true;
      const timer = window.setTimeout(() => {
        setQuery("");
        setActive(0);
        setCopied(false);
        inputRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(timer);
    }
    if (!isCommandOpen && wasOpen.current) {
      wasOpen.current = false;
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
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

  const onDialogKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeCommand();
      return;
    }

    if (e.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
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
          onKeyDown={onDialogKeyDown}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-[2px]"
            aria-label={t("close")}
            tabIndex={-1}
            onClick={closeCommand}
          />

          <motion.div
            ref={panelRef}
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
