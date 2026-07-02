import { siteConfig } from "@/config/site";

export function absoluteUrl(path = ""): string {
  if (!path) {
    return siteConfig.url;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path.startsWith("/") ? path : `/${path}`, siteConfig.url).toString();
}

export const defaultOgImage = absoluteUrl("/opengraph-image");
