"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { scrollToHash } from "@/components/providers/LenisProvider";
import { cn } from "@/lib/cn";

/**
 * The one action, always reachable on a phone. Appears once the hero is behind
 * you — before that the hero's own CTA is on screen and this would just cover
 * it — and hides again over the contact section, where the form it points at
 * is already in view.
 *
 * Mobile only: on a desktop the nav bar is always visible and carries Contact.
 */
export function StickyCta() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Off the homepage the component renders nothing, so there is no state to
    // keep in sync — the anchor it points at does not exist there.
    if (pathname !== "/") return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const past = window.scrollY > window.innerHeight * 0.9;
      const contact = document.getElementById("contact");
      const atContact = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.75
        : false;
      setShown(past && !atContact);
    };

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // Through the frame, not straight away: the first measurement is a read of
    // the scroll position, which is not something to do during render.
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md",
        "px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden",
        "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "motion-reduce:transition-none",
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
      // Hidden from the accessibility tree when off screen, so a screen reader
      // does not announce a control the eye cannot see.
      aria-hidden={!shown}
    >
      <a
        href="#contact"
        aria-label={t("stickyCtaLabel")}
        tabIndex={shown ? undefined : -1}
        onClick={(event) => {
          event.preventDefault();
          scrollToHash("#contact");
        }}
        className={cn(
          "flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-accent px-5 py-3",
          "text-sm font-medium text-on-accent transition-colors hover:bg-foreground",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        )}
      >
        {t("stickyCta")}
        <span aria-hidden>↗</span>
      </a>
    </div>
  );
}
