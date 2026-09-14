import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";
import { ALL_PROJECT_IDS, isProjectId } from "@/lib/projects";
import en from "../../../../messages/en.json";

export const alt = `${SITE.name} — case study`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ALL_PROJECT_IDS.map((slug) => ({ slug }));
}

/**
 * A card per case study. The homepage's card is about the person; these are
 * about the work, so they lead with the project, the role and the year —
 * which is what someone deciding whether to open the link needs.
 *
 * Same palette and same layout as the root card, deliberately: two shared
 * links from this domain should look like they came from the same place.
 */
export default async function CaseStudyOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = isProjectId(slug) ? slug : null;
  const project = id ? en.work.projects[id] : null;
  const study = id ? en.work.caseStudy[id] : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0a0a0a",
          color: "#f5f5f0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{ width: 14, height: 14, borderRadius: 7, background: "#b8f300" }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8a8a85",
            }}
          >
            {project ? `${project.category} · ${project.year}` : en.work.headline}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}
          >
            {project?.title ?? SITE.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              color: "#c9c9c2",
              maxWidth: 940,
            }}
          >
            {project?.summary ?? en.meta.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#8a8a85",
          }}
        >
          <span style={{ color: "#b8f300" }}>{study?.role ?? en.hero.roleLabel}</span>
          <span>usukhbayar.dev</span>
        </div>
      </div>
    ),
    size,
  );
}
