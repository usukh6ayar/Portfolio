export const locales = ["en", "mn"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_STORAGE_KEY = "portfolio-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "mn";
}

/** Map browser language tags → app locale */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return defaultLocale;

  const candidates = [
    navigator.language,
    ...(navigator.languages ?? []),
  ].filter(Boolean);

  for (const tag of candidates) {
    const base = tag.toLowerCase().split("-")[0];
    if (base === "mn") return "mn";
    if (base === "en") return "en";
  }

  return defaultLocale;
}

export function resolveInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // ignore
  }
  return detectBrowserLocale();
}

export function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}
