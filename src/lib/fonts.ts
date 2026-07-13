import localFont from "next/font/local";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";

/**
 * Clash Display — Latin display headlines
 * Cyrillic glyphs fall through to Manrope (see globals.css stack).
 * Weights limited to what the UI actually uses (no Bold/700).
 */
export const clashDisplay = localFont({
  src: [
    {
      path: "../fonts/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
});

/**
 * Manrope — Cyrillic-capable display companion
 * Keeps hierarchy when Mongolian headlines need full glyph coverage.
 */
export const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

/**
 * Inter — body / UI, excellent Latin + Cyrillic
 */
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

/**
 * JetBrains Mono — labels, stack, counters, kbd
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});
