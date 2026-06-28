import type { MetadataRoute } from "next";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getAllBlogPosts } from "@/lib/blogs";
import { getVehicles } from "@/lib/api/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  try {
    const vehiclesPage = await getVehicles(1);
    const vehicleRoutes: MetadataRoute.Sitemap = vehiclesPage.data.map(
      (vehicle) => ({
        url: `${siteConfig.url}${routes.vehicle(vehicle.slug)}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    );

    const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
      url: `${siteConfig.url}${routes.blogPost(post.slug)}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [
      {
        url: siteConfig.url,
        lastModified,
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${siteConfig.url}${routes.vehicles}`,
        lastModified,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${siteConfig.url}${routes.blog}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: `${siteConfig.url}${routes.about}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${siteConfig.url}${routes.terms}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      ...blogRoutes,
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
