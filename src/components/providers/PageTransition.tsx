"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/easings";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Route-level presence + layout group for shared project media/titles.
 * Calm crossfade — shared elements handle the memorable handoff.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={
            reduced ? false : { opacity: 0, y: 10 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduced
              ? { opacity: 1 }
              : { opacity: 0, y: -8, transition: { duration: 0.25 } }
          }
          transition={{ duration: 0.4, ease: EASE.outExpo }}
          className="flex min-h-full flex-1 flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}
