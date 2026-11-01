/**
 * Immersive routes render full-bleed with none of the portfolio chrome
 * (nav, scroll progress, custom cursor, preloader). Each challenge site is a
 * stand-alone client site and must look like one, on screen and in a reel.
 */
export function isImmersivePath(pathname: string | null | undefined): boolean {
  return !!pathname && pathname.startsWith("/challenge/");
}
