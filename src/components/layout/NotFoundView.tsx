"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { TextLink } from "@/components/ui/TextLink";

/** three + R3F stays off the server and out of every other route's bundle. */
const BuddyAvatar = dynamic(
  () => import("@/components/work/BuddyAvatar").then((m) => m.BuddyAvatar),
  { ssr: false },
);

const noop = () => () => {};

/**
 * The address that failed, read in the browser only. The 404 is prerendered
 * once, at build time, when there is no request path to show — rendering one
 * on the server would print the placeholder route and then disagree with the
 * client on hydration.
 */
function useMissingPath(): string | null {
  return useSyncExternalStore(
    noop,
    () => {
      try {
        return decodeURIComponent(window.location.pathname);
      } catch {
        // A malformed escape: show it as it arrived.
        return window.location.pathname;
      }
    },
    () => null,
  );
}

/**
 * The 404: Spark, the SparkXP fox, searching for the page. He looks around
 * until the visitor moves the pointer, then looks at them instead, and goes
 * back to searching when it rests. The page says which address failed, so the
 * visitor can see a typo for themselves.
 */
export function NotFoundView() {
  const t = useTranslations("notFound");
  const path = useMissingPath();

  return (
    <section className="container-page flex min-h-[100dvh] items-center pb-16 pt-[calc(var(--nav-height)+2rem)]">
      <div className="grid w-full items-center gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
        <div>
          <p className="text-sm text-muted">{t("code")}</p>
          <h1 className="mt-3 max-w-[14ch] font-display text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-[34rem] text-base leading-[1.75] text-muted">
            {path
              ? t.rich("body", {
                  url: path,
                  path: (chunks) => <code className="break-all font-mono text-[0.9em] text-foreground">{chunks}</code>,
                })
              : t("bodyNoPath")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center rounded-lg bg-accent px-5 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
            >
              {t("home")}
            </Link>
            <TextLink href="/#featured" className="text-sm">
              {t("work")}
            </TextLink>
          </div>
        </div>

        <BuddyAvatar bare search className="aspect-square w-full max-w-[34rem] justify-self-center" />
      </div>
    </section>
  );
}
