import localFont from "next/font/local";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";

/**
 * Clash Display — Latin display headlines
 * Cyrillic glyphs fall through to Manrope (see globals.css stack).
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
    {
      path: "../fonts/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

/**
 * Manrope — Cyrillic-capable display companion
 * Keeps hierarchy when Mongolian headlines need full glyph coverage.
 */
export const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

/**
 * Inter — body / UI, excellent Latin + Cyrillic
 */
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * JetBrains Mono — labels, stack, counters, kbd
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});
