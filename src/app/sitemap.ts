import type { MetadataRoute } from "next";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getAllBlogPosts } from "@/lib/blogs";
import { getAllVehicles } from "@/lib/api/public";
import { absoluteUrl } from "@/lib/seo/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  try {
    const vehicles = await getAllVehicles();
    const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
      url: absoluteUrl(routes.vehicle(vehicle.slug)),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
      url: absoluteUrl(routes.blogPost(post.slug)),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [
      {
        url: absoluteUrl(),
        lastModified,
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: absoluteUrl(routes.vehicles),
        lastModified,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: absoluteUrl(routes.blog),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: absoluteUrl(routes.about),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: absoluteUrl(routes.contact),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: absoluteUrl(routes.terms),
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
        url: absoluteUrl(),
        lastModified,
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
