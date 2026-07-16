import type { MetadataRoute } from "next";

import { routes } from "@/config/routes";
import { getAllBlogPosts } from "@/lib/blogs";
import { resolveApiUrl } from "@/lib/api/base-url";
import { absoluteUrl } from "@/lib/seo/urls";

/** Refresh often so newly added cars appear in Google's sitemap quickly. */
export const revalidate = 300;

function staticRoutes(lastModified: Date): MetadataRoute.Sitemap {
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
  ];
}

type PublicVehiclesPage = {
  data?: Array<{ slug?: string | null }>;
  meta?: { last_page?: number };
};

async function fetchVehiclesPage(page: number): Promise<PublicVehiclesPage> {
  const url = resolveApiUrl(`/public/vehicles?page=${page}`);
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Vehicles API returned ${response.status}`);
  }

  return (await response.json()) as PublicVehiclesPage;
}

async function getVehicleSitemapRoutes(
  lastModified: Date,
): Promise<MetadataRoute.Sitemap> {
  try {
    const firstPage = await fetchVehiclesPage(1);
    const vehicles = [...(firstPage.data ?? [])];
    const lastPage = firstPage.meta?.last_page ?? 1;

    for (let page = 2; page <= lastPage; page += 1) {
      const nextPage = await fetchVehiclesPage(page);
      vehicles.push(...(nextPage.data ?? []));
    }

    return vehicles
      .map((vehicle) => vehicle.slug?.trim())
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => ({
        url: absoluteUrl(routes.vehicle(slug)),
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: absoluteUrl(routes.blogPost(post.slug)),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const vehicleRoutes = await getVehicleSitemapRoutes(lastModified);

  return [...staticRoutes(lastModified), ...blogRoutes, ...vehicleRoutes];
}
