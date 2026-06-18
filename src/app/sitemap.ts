import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getVehicles } from "@/lib/api/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  try {
    const vehiclesPage = await getVehicles(1);
    const vehicleRoutes: MetadataRoute.Sitemap = vehiclesPage.data.map(
      (vehicle) => ({
        url: `${siteConfig.url}/cars/${vehicle.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    );

    return [
      {
        url: siteConfig.url,
        lastModified,
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${siteConfig.url}/cars`,
        lastModified,
        changeFrequency: "daily",
        priority: 0.9,
      },
      ...vehicleRoutes,
    ];
  } catch {
    return [
      {
        url: siteConfig.url,
        lastModified,
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
