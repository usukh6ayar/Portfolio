"use client";

import { useTranslations } from "next-intl";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import type { Locale } from "@/lib/i18n/settings";
import { cn } from "@/lib/cn";

/**
 * Minimal language toggle — EN | МН
 * No flags. Instant client switch; scroll position preserved.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("lang");
  const { locale, setLocale } = useLocaleSwitch();

  const setLang = (next: Locale) => {
    if (next === locale) return;
    setLocale(next);
  };

  return (
    <div
      role="group"
      aria-label={t("switcher")}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface-1 px-1.5 py-1",
        className,
      )}
    >
      <LangButton
        label={t("en")}
        fullLabel={t("enFull")}
        active={locale === "en"}
        onClick={() => setLang("en")}
      />
      <span className="select-none text-[0.65rem] text-muted/50" aria-hidden>
        |
      </span>
      <LangButton
        label={t("mn")}
        fullLabel={t("mnFull")}
        active={locale === "mn"}
        onClick={() => setLang("mn")}
      />
    </div>
  );
}

function LangButton({
  label,
  fullLabel,
  active,
  onClick,
}: {
  label: string;
  fullLabel: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={fullLabel}
      className={cn(
        "rounded-full px-2 py-0.5 font-mono text-[0.65rem] tracking-wide transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        active
          ? "bg-surface-2 text-foreground"
          : "text-muted hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
