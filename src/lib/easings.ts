/** Shared easing curves — keep motion language consistent site-wide */
export const EASE = {
  /** Primary entrance / reveal — soft, confident settle */
  outExpo: [0.16, 1, 0.3, 1] as const,
  /** CSS string form for GSAP / style attributes */
  outExpoCss: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Snappy UI interactions (hover, press) */
  outQuad: [0.25, 0.46, 0.45, 0.94] as const,
  outQuadCss: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;

export const DURATION = {
  instant: 0.15,
  fast: 0.25,
  base: 0.45,
  slow: 0.75,
  preloader: 1.4,
} as const;
