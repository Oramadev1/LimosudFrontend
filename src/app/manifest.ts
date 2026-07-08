import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#cc0000",
    lang: siteConfig.language,
    orientation: "portrait-primary",
    categories: ["business", "travel"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: siteConfig.brandIcon,
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
