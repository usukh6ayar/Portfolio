import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";
import en from "../../messages/en.json";

export const alt = en.meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card every shared link renders. Generated from the same copy the page
 * uses, so the two can never drift — and drawn in the site's own palette
 * rather than a stock template.
 */
export default function OpengraphImage() {
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
        {/* The acid mark, top left — the one accent the site allows itself. */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: "#b8f300",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8a8a85",
            }}
          >
            {en.hero.roleLabel}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              fontSize: 34,
              lineHeight: 1.35,
              color: "#c9c9c2",
              maxWidth: 900,
            }}
          >
            <span>I design,</span>
            <span style={{ color: "#b8f300" }}>build, and ship</span>
            <span>products people actually use.</span>
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
          <span>usukhbayar.dev</span>
          <span>Ulaanbaatar, Mongolia</span>
        </div>
      </div>
    ),
    size,
  );
}
