"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "@/lib/i18n/messages";
import {
  defaultLocale,
  isLocale,
  persistLocale,
  resolveInitialLocale,
  type Locale,
} from "@/lib/i18n/settings";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocaleSwitch() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleSwitch must be used within I18nProvider");
  }
  return ctx;
}

/** Subscribe to same-tab locale updates via a custom event */
const LOCALE_EVENT = "portfolio-locale-change";

function subscribeLocale(onStoreChange: () => void) {
  window.addEventListener(LOCALE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(LOCALE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getLocaleSnapshot(): Locale {
  return resolveInitialLocale();
}

function getServerSnapshot(): Locale {
  return defaultLocale;
}

function writeLocale(locale: Locale) {
  persistLocale(locale);
  document.documentElement.lang = locale;
  window.dispatchEvent(new Event(LOCALE_EVENT));
}

/**
 * next-intl without URL locales — single SPA, client-side switch.
 * Preference: localStorage → browser language → English.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerSnapshot,
  );

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return;
    writeLocale(next);
  }, []);

  const messages = useMemo(() => getMessages(locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Asia/Ulaanbaatar"
      >
        <LocaleDocumentSync locale={locale} title={messages.meta.title} />
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

function LocaleDocumentSync({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = title;
  }, [locale, title]);

  return null;
}
