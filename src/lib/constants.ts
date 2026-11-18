/**
 * Non-translatable site config (URLs, stable ids).
 * All user-facing copy lives in /messages/*.json
 */

import { SHOW_CHALLENGE } from "@/lib/challenge";

export const SITE = {
  name: "Usukhbayar",
  email: "usukhbayrgan@gmail.com",
  url: "https://usukhbayar.dev",
} as const;

/**
 * Direct lines, shown as plain text in Contact. Most people who hire through
 * this site would rather call or DM than fill in a form, and a link alone
 * (mailto:, tel:) does nothing on a device with no app for it.
 */
export const DIRECT_CONTACT = {
  phoneDisplay: "9069 3000",
  phoneHref: "tel:+97690693000",
  instagramHandle: "@usukh6ayar",
  instagramDm: "https://ig.me/m/usukh6ayar",
  instagramProfile: "https://instagram.com/usukh6ayar",
  email: SITE.email,
} as const;

/**
 * Nav hrefs only — labels come from i18n keys `nav.*`. In page order.
 *
 * Five is the ceiling. Skills remains discoverable in the page and command
 * palette. Challenge takes Experience's slot once the series is on the page
 * (SHOW_CHALLENGE): it is what visitors arriving from a reel came to see.
 * Until then the section does not render, so neither does its link.
 */
export const NAV_ITEMS = [
  { key: "work" as const, href: "#featured" },
  SHOW_CHALLENGE
    ? { key: "challenge" as const, href: "#challenge" }
    : { key: "experience" as const, href: "#experience" },
  { key: "services" as const, href: "#services" },
  { key: "about" as const, href: "#about" },
  { key: "contact" as const, href: "#contact" },
];

/** Social hrefs — labels from i18n keys `social.*` */
export const SOCIAL_ITEMS = [
  {
    key: "github" as const,
    href: "https://github.com/usukh6ayar",
    external: true,
  },
  {
    key: "instagram" as const,
    href: "https://instagram.com/usukh6ayar",
    external: true,
  },
  {
    key: "email" as const,
    href: `mailto:${SITE.email}`,
    external: false,
  },
];

export const CONTENT_MAX = 1440;

/** Portrait asset config (not copy) */
export const PORTRAIT = {
  hasPortrait: true,
  src: "/images/portrait.jpg",
} as const;
