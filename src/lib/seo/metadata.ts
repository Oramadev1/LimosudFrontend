import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

import { absoluteUrl, defaultOgImage } from "./urls";

type OgImageInput =
  | string
  | {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    };

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  openGraphType?: "website" | "article";
  locale?: string;
  images?: OgImageInput | OgImageInput[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

function normalizeImages(
  images: OgImageInput | OgImageInput[] | undefined,
  alt: string,
) {
  const list = images ? (Array.isArray(images) ? images : [images]) : [defaultOgImage];

  return list.map((image) => {
    if (typeof image === "string") {
      return {
        url: absoluteUrl(image),
        width: 1200,
        height: 630,
        alt,
      };
    }

    return {
      url: absoluteUrl(image.url),
      width: image.width ?? 1200,
      height: image.height ?? 630,
      alt: image.alt ?? alt,
    };
  });
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
  keywords = [...siteConfig.keywords],
  noIndex = false,
  openGraphType = "website",
  locale = siteConfig.locale,
  images,
  publishedTime,
  modifiedTime,
  authors,
}: CreateMetadataOptions = {}): Metadata {
  const pageTitle = title ?? siteConfig.defaultTitle;
  const canonicalUrl = absoluteUrl(path);
  const ogImages = normalizeImages(images, pageTitle) ?? [];

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
      locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description,
      images: ogImages,
      ...(openGraphType === "article" && publishedTime
        ? {
            publishedTime,
            ...(modifiedTime ? { modifiedTime } : {}),
            ...(authors?.length ? { authors } : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: ogImages.map((image) =>
        typeof image === "string" ? image : image.url,
      ),
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
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}
