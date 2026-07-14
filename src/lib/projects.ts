/**
 * Project registry — structure only.
 * Copy: messages/*.json → work.projects / work.featured / work.caseStudies
 */

export const FEATURED_ID = "sparkxp" as const;

export const STACKED_ORDER = [
  "beauty-corner",
  "qr-menu",
  "ai-image-studio",
] as const;

export const ALL_PROJECT_IDS = [FEATURED_ID, ...STACKED_ORDER] as const;

export type ProjectId = (typeof ALL_PROJECT_IDS)[number];

export type GalleryImage = {
  src: string;
  /** CSS object-position for cover cropping (default center) */
  position?: string;
};

export type ProjectMeta = {
  id: ProjectId;
  href: string;
  /** Product screenshot — full bleed, not a device mock */
  image: string | null;
  tone: "lime" | "violet" | "cool" | "warm" | "neutral";
  /** Case-study gallery — brand / in-app artwork, in display order */
  gallery?: GalleryImage[];
};

export const PROJECTS: Record<ProjectId, ProjectMeta> = {
  sparkxp: {
    id: "sparkxp",
    href: "/work/sparkxp",
    image: "/images/work/sparkxp-hero.webp",
    tone: "violet",
    gallery: [
      { src: "/images/work/sparkxp-island.webp" },
      { src: "/images/work/sparkxp-quiz.webp", position: "right center" },
    ],
  },
  "beauty-corner": {
    id: "beauty-corner",
    href: "/work/beauty-corner",
    image: null,
    tone: "violet",
  },
  "qr-menu": {
    id: "qr-menu",
    href: "/work/qr-menu",
    image: null,
    tone: "cool",
  },
  "ai-image-studio": {
    id: "ai-image-studio",
    href: "/work/ai-image-studio",
    image: null,
    tone: "warm",
  },
};

export function isProjectId(value: string): value is ProjectId {
  return (ALL_PROJECT_IDS as readonly string[]).includes(value);
}
