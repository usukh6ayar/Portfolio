import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/work/CaseStudyView";
import {
  ALL_PROJECT_IDS,
  PROJECTS,
  isProjectId,
  type ProjectId,
} from "@/lib/projects";
import { SITE } from "@/lib/constants";
import en from "../../../../messages/en.json";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ALL_PROJECT_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isProjectId(slug)) return { title: "Work" };

  const project = en.work.projects[slug];
  const study = en.work.caseStudy[slug as keyof typeof en.work.caseStudy];

  const title = project?.title ?? slug;
  const description =
    study && typeof study === "object" && "overview" in study
      ? study.overview
      : en.work.intro;

  // These are the deepest pages on the site; until now they shared the
  // homepage's card and had no canonical of their own.
  return {
    title,
    description,
    alternates: { canonical: PROJECTS[slug].href },
    openGraph: {
      title: `${title} · ${SITE.name}`,
      description,
      type: "article",
      url: `${SITE.url}${PROJECTS[slug].href}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE.name}`,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isProjectId(slug)) notFound();
  return <CaseStudyView id={slug as ProjectId} />;
}
