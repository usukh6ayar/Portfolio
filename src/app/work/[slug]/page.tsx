import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/work/CaseStudyView";
import {
  ALL_PROJECT_IDS,
  isProjectId,
  type ProjectId,
} from "@/lib/projects";
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

  return {
    title: project?.title ?? slug,
    description:
      study && typeof study === "object" && "overview" in study
        ? study.overview
        : en.work.intro,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isProjectId(slug)) notFound();
  return <CaseStudyView id={slug as ProjectId} />;
}
