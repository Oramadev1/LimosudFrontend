import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#cc0000",
          color: "#ffffff",
          fontSize: "18px",
          fontWeight: 800,
          borderRadius: "8px",
        }}
      >
        {siteConfig.shortName.slice(0, 1)}
      </div>
    ),
    size,
  );
}
