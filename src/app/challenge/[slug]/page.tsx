import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChallengeShell } from "@/components/challenge/ChallengeShell";
import {
  ROUTABLE_SITES,
  challengeHref,
  getChallengeSite,
} from "@/lib/challenge";
import { SITE } from "@/lib/constants";
import mn from "../../../../messages/mn.json";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type SiteCopy = { title: string; tagline: string };
const COPY = mn.challenge.sites as Record<string, SiteCopy | undefined>;

export const dynamicParams = false;

export function generateStaticParams() {
  return ROUTABLE_SITES.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = getChallengeSite(slug);
  const copy = COPY[slug];
  if (!site || !copy) return { title: "Challenge" };

  const href = challengeHref(slug);
  return {
    title: copy.title,
    description: copy.tagline,
    ...(site.status === "live" ? {} : { robots: { index: false, follow: false } }),
    alternates: { canonical: href },
    openGraph: {
      title: `${copy.title} · ${SITE.name}`,
      description: copy.tagline,
      type: "website",
      url: `${SITE.url}${href}`,
      ...(site.poster ? { images: [site.poster] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.title} · ${SITE.name}`,
      description: copy.tagline,
    },
  };
}

export default async function ChallengeSitePage({ params }: PageProps) {
  const { slug } = await params;
  const site = getChallengeSite(slug);
  if (!site) notFound();
  return <ChallengeShell slug={site.slug} n={site.n} />;
}
