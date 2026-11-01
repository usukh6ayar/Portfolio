export const locales = ["en", "mn"] as const;
export type Locale = (typeof locales)[number];

/**
 * Mongolian first: the people who hire through this site are Mongolian
 * businesses, and most of their phones report an English UI language, so
 * browser detection would hand them the English page. English stays one
 * tap away in the language switch.
 */
export const defaultLocale: Locale = "mn";
export const LOCALE_STORAGE_KEY = "portfolio-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "mn";
}

export function resolveInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // ignore
  }
  return defaultLocale;
}

export function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}
