"use client";

import { useTranslations } from "next-intl";

/** Keyboard-first escape hatch for the persistent navigation. */
export function SkipLink() {
  const t = useTranslations("common");

  return (
    <a
      href="#main"
      className="fixed left-4 top-3 z-[400] -translate-y-20 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-xl transition-transform duration-200 focus:translate-y-0 motion-reduce:transition-none"
    >
      {t("skipToContent")}
    </a>
  );
}
