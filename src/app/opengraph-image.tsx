import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = siteConfig.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #7f1d1d 100%)",
          color: "#ffffff",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "#cc0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            LC
          </div>
          <div style={{ fontSize: "34px", fontWeight: 800 }}>{siteConfig.brand}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "900px" }}>
          <div style={{ fontSize: "64px", fontWeight: 800, lineHeight: 1.05 }}>
            Location de voitures à Dakhla
          </div>
          <div style={{ fontSize: "30px", color: "#e2e8f0", lineHeight: 1.35 }}>
            {siteConfig.description}
          </div>
        </div>

        <div style={{ fontSize: "24px", color: "#fca5a5" }}>{siteConfig.url.replace(/^https?:\/\//, "")}</div>
      </div>
    ),
    size,
  );
}
