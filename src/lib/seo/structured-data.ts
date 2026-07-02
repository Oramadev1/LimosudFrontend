import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { getVehicleImageUrl } from "@/lib/images";
import type { Vehicle } from "@/types/api";
import type { BlogPost } from "@/types/blog";

import { absoluteUrl } from "./urls";

const dakhlaGeo = {
  "@type": "GeoCoordinates",
  latitude: 23.6848,
  longitude: -15.9579,
};

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.heroBanner),
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Dakhla",
      addressCountry: "MA",
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["fr", "en", "es"],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}${routes.vehicles}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.heroBanner),
    logo: absoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    telephone: [siteConfig.phone, siteConfig.secondaryPhone],
    priceRange: "$$",
    currenciesAccepted: "MAD",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Dakhla",
      addressRegion: "Dakhla-Oued Ed-Dahab",
      addressCountry: "MA",
    },
    geo: dakhlaGeo,
    areaServed: {
      "@type": "City",
      name: "Dakhla",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
  };
}

export function getVehicleProductSchema(vehicle: Vehicle) {
  const image = getVehicleImageUrl(vehicle);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vehicle.name,
    description:
      vehicle.description?.trim() ||
      `Rent ${vehicle.name} in Dakhla with Limosud Cars.`,
    sku: vehicle.slug,
    image: image ? [image] : undefined,
    brand: vehicle.brand
      ? {
          "@type": "Brand",
          name: vehicle.brand.name,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(routes.vehicle(vehicle.slug)),
      priceCurrency: "MAD",
      price: vehicle.daily_price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoRental",
        name: siteConfig.name,
      },
    },
  };
}

export function getBlogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.coverImage),
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.logo),
      },
    },
    mainEntityOfPage: absoluteUrl(routes.blogPost(post.slug)),
  };
}

export function getFaqSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
