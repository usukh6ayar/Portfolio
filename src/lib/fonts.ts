import localFont from "next/font/local";

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
 * Keeps hierar/*
 * Manrope, Inter and JetBrains Mono are self-hosted rather than loaded through
 * next/font/google, so a build never depends on reaching Google Fonts (Vercel
 * builds failed intermittently fetching them). Each file is the Google Fonts
 * variable font, cut to the weights in use and to Latin + Cyrillic +
 * Cyrillic Ext (Mongolian Ө and Ү live in Cyrillic Ext) plus ₮ and arrows.
 * Licences: src/fonts/licenses.
 */

/**
 * Manrope — Cyrillic-capable display companion
 * Keeps hierarchy when Mongolian headlines need full glyph coverage.
 */
export const manrope = localFont({
  src: "../fonts/Manrope-Variable.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
});

/**
 * Inter — body / UI, excellent Latin + Cyrillic
 */
export const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
});

/**
 * JetBrains Mono — labels, stack, counters, kbd
 */
export const jetbrainsMono = localFont({
  src: "../fonts/JetBrainsMono-Variable.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: false,
  preload: false,
});
