import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  openGraphType?: "website" | "article";
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
  keywords = [...siteConfig.keywords],
  noIndex = false,
  openGraphType = "website",
}: CreateMetadataOptions = {}): Metadata {
  const pageTitle = title ?? siteConfig.defaultTitle;
  const canonicalUrl = new URL(path, siteConfig.url).toString();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
      absolute: title ? pageTitle : undefined,
    },
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: openGraphType,
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      ...(siteConfig.twitterHandle
        ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle }
        : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
