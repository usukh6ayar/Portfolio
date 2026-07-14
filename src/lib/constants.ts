/**
 * Non-translatable site config (URLs, stable ids).
 * All user-facing copy lives in /messages/*.json
 */

export const SITE = {
  name: "Usukhbayar",
  email: "usukhbayrgan@gmail.com",
  url: "https://usukhbayar.dev",
} as const;

/** Nav hrefs only — labels come from i18n keys `nav.*` */
export const NAV_ITEMS = [
  { key: "about" as const, href: "#about" },
  { key: "work" as const, href: "#featured" },
  { key: "stack" as const, href: "#stack" },
  { key: "contact" as const, href: "#contact" },
];

/** Social hrefs — labels from i18n keys `social.*` */
export const SOCIAL_ITEMS = [
  {
    key: "github" as const,
    href: "https://github.com",
    external: true,
  },
  {
    key: "linkedin" as const,
    href: "https://linkedin.com",
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
