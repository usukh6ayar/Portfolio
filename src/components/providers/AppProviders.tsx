"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Preloader } from "@/components/layout/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";

/** Lazy — command palette JS only loads on first open / after idle */
const CommandPalette = dynamic(
  () =>
    import("@/components/ui/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);

type AppContextValue = {
  isReady: boolean;
  setReady: () => void;
  isCommandOpen: boolean;
  openCommand: () => void;
  closeCommand: () => void;
  toggleCommand: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProviders");
  }
  return ctx;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  /** Defer palette mount until first open — zero work until needed */
  const [paletteMounted, setPaletteMounted] = useState(false);

  const setReady = useCallback(() => setIsReady(true), []);
  const openCommand = useCallback(() => {
    setPaletteMounted(true);
    setIsCommandOpen(true);
  }, []);
  const closeCommand = useCallback(() => setIsCommandOpen(false), []);
  const toggleCommand = useCallback(() => {
    setPaletteMounted(true);
    setIsCommandOpen((v) => !v);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteMounted(true);
        setIsCommandOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      setReady,
      isCommandOpen,
      openCommand,
      closeCommand,
      toggleCommand,
    }),
    [
      isReady,
      setReady,
      isCommandOpen,
      openCommand,
      closeCommand,
      toggleCommand,
    ],
  );

  return (
    <I18nProvider>
      <AppContext.Provider value={value}>
        <LenisProvider>
          <CustomCursor />
          <Preloader />
          {children}
          {paletteMounted && <CommandPalette />}
        </LenisProvider>
      </AppContext.Provider>
    </I18nProvider>
  );
}
