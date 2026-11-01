"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isImmersivePath } from "@/lib/routes";

/** Portfolio chrome (nav, progress bar) — absent on immersive routes. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isImmersivePath(pathname)) return null;
  return <>{children}</>;
}
