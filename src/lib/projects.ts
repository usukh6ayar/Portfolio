/**
 * Project registry — structure only.
 * Copy: messages/*.json → work.projects / work.featured / work.caseStudies
 */

export const FEATURED_ID = "sparkxp" as const;

/**
 * Secondary "Selected Works" projects, in display order. Every id here needs
 * copy in messages/*.json (work.projects.<id>, work.caseStudy.<id>, command.<id>)
 * and an entry in PROJECTS below. Ids double as case-study slugs.
 */
export const STACKED_ORDER = ["nomadkids"] as const;

export const ALL_PROJECT_IDS = [FEATURED_ID, ...STACKED_ORDER] as const;

export type ProjectId = (typeof ALL_PROJECT_IDS)[number];

export type GalleryImage = {
  src: string;
  /** CSS object-position for cover cropping (default center) */
  position?: string;
  /**
   * Which surface of the product this shot comes from. Copy lives in
   * messages → work.surfaces.<key>; a project with one surface can omit it.
   */
  surface?:
    | "app"
    | "landing"
    | "admin"
    | "director"
    | "teacher"
    | "cook"
    | "parent";
};

/**
 * Outbound links a visitor can actually open. Labels come from
 * messages → work.links.<kind>. Only list URLs that answer to a signed-out
 * browser — a private repo reads as a 404 to whoever clicks it.
 */
export type ProjectLinkKind = "live" | "repo" | "admin";

export type ProjectLink = {
  kind: ProjectLinkKind;
  href: string;
};

export type ProjectMeta = {
  id: ProjectId;
  href: string;
  /** Product screenshot — full bleed, not a device mock */
  image: string | null;
  tone: "lime" | "violet" | "cool" | "warm" | "neutral";
  /** Case-study gallery — brand / in-app artwork, in display order */
  gallery?: GalleryImage[];
  links?: ProjectLink[];
};

export const PROJECTS: Record<ProjectId, ProjectMeta> = {
  /**
   * One product, three surfaces: the student/teacher app, the public landing
   * page, and the admin dashboard the content team works in.
   */
  sparkxp: {
    id: "sparkxp",
    href: "/work/sparkxp",
    image: "/images/work/sparkxp-app-hero.webp",
    tone: "violet",
    gallery: [
      { src: "/images/work/sparkxp-app-lessons.webp", surface: "app" },
      { src: "/images/work/sparkxp-app-review.webp", surface: "app" },
      { src: "/images/work/sparkxp-app-buddychat.webp", surface: "app" },
      { src: "/images/work/sparkxp-app-quiz.webp", surface: "app" },
      { src: "/images/work/sparkxp-landing-hero.webp", surface: "landing" },
      { src: "/images/work/sparkxp-landing-pricing.webp", surface: "landing" },
      { src: "/images/work/sparkxp-admin-buddy.webp", surface: "admin" },
      { src: "/images/work/sparkxp-admin-usage.webp", surface: "admin" },
    ],
    links: [
      { kind: "live", href: "https://spark-xp-web.vercel.app" },
      { kind: "admin", href: "https://spark-xp.vercel.app" },
      { kind: "repo", href: "https://github.com/usukh6ayar/SparkXP" },
    ],
  },
  nomadkids: {
    id: "nomadkids",
    href: "/work/nomadkids",
    image: "/images/work/nomadkids-hero.webp",
    tone: "cool",
    gallery: [
      { src: "/images/work/nomadkids-director.webp", surface: "director" },
      { src: "/images/work/nomadkids-esis.webp", surface: "director" },
      { src: "/images/work/nomadkids-teacher.webp", surface: "teacher" },
      { src: "/images/work/nomadkids-assessment.webp", surface: "teacher" },
      { src: "/images/work/nomadkids-portfolio.webp", surface: "teacher" },
      { src: "/images/work/nomadkids-cook.webp", surface: "cook" },
      { src: "/images/work/nomadkids-parent.webp", surface: "parent" },
    ],
    links: [
      { kind: "live", href: "https://nomadkids.mn" },
      { kind: "repo", href: "https://github.com/usukh6ayar/NomadKids" },
    ],
  },
};

export function isProjectId(value: string): value is ProjectId {
  return (ALL_PROJECT_IDS as readonly string[]).includes(value);
}
