/**
 * Non-translatable site config (URLs, stable ids).
 * All user-facing copy lives in /messages/*.json
 */

export const SITE = {
  name: "Usukhbayar",
  email: "usukhbayrgan@gmail.com",
  url: "https://usukhbayar.dev",
} as const;

/**
 * Nav hrefs only — labels come from i18n keys `nav.*`. In page order, and
 * capped at four: Capabilities (`#stack`) is reachable by scrolling and from
 * the command palette, and a fifth item costs more than it returns.
 */
export const NAV_ITEMS = [
  { key: "work" as const, href: "#featured" },
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
