"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * slug → site component. Each site is its own chunk, so one heavy WebGL site
 * never weighs on the portfolio or on the other 29.
 */
export const SITE_COMPONENTS: Record<string, ComponentType> = {
  starter: dynamic(() => import("./sites/starter/Site"), { ssr: false }),
};
