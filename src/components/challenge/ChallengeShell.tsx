"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { SITE_COMPONENTS } from "@/challenge/components";
import { RecordModeProvider, useRecordMode } from "@/challenge/record-mode";
import { CHALLENGE_TOTAL, formatSiteNumber } from "@/lib/challenge";

/**
 * Frame around one challenge site: the site itself, full-bleed, plus a small
 * overlay that turns a curious visitor into an inquiry. The overlay hides in
 * record mode so it never shows up in a reel.
 */
export function ChallengeShell({ slug, n }: { slug: string; n: number }) {
  const Site = SITE_COMPONENTS[slug];
  if (!Site) return null;

  return (
    <RecordModeProvider>
      <Site />
      <Overlay n={n} />
    </RecordModeProvider>
  );
}

function Overlay({ n }: { n: number }) {
  const t = useTranslations("challenge");
  const record = useRecordMode();
  if (record.active) return null;

  const pill =
    "pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.8125rem] backdrop-blur-md transition-colors";
  const ghost = `${pill} border border-white/15 bg-black/55 text-white hover:border-white/35`;
  const solid = `${pill} bg-[#b8f300] font-medium text-[#0a0a0a] hover:bg-[#c8ff1a]`;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]">
      <Link href="/#challenge" className={ghost}>
        <span aria-hidden>←</span>
        {t("back")}
      </Link>
      <div className="flex items-center gap-2">
        {n > 0 && (
          <span className="hidden font-mono text-[0.7rem] tracking-wide text-white/80 sm:inline">
            {t("siteLabel", {
              n: formatSiteNumber(n),
              total: CHALLENGE_TOTAL,
            })}
          </span>
        )}
        <Link href="/#contact" className={solid}>
          {t("order")}
        </Link>
      </div>
    </div>
  );
}
