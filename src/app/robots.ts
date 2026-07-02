import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/urls";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    rules: isProduction
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/_next/", "/book/", "/settings", "/checkout"],
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${absoluteUrl()}/sitemap.xml`,
  };
}
