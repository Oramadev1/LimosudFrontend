import type { Redirect } from "next/dist/lib/load-custom-routes";

const LOCALE_PREFIXES = ["fr", "en", "es"] as const;

/**
 * Old WordPress paths from Google Search Console (Jul–Sep 2025).
 * Values are the matching page on the new Next.js site.
 */
const LEGACY_PATH_MAP: Record<string, string> = {
  "/car-listing": "/vehicles",
  "/contact": "/contact",
  "/about": "/about",
  "/blog": "/blog",
  "/category/uncategorized": "/blog",
  "/single-blog": "/blog",
  "/uncategorized": "/blog",
  "/faq": "/",
  "/hello-world": "/",
  "/car-rental-dakhla-blog": "/blog/location-voiture-dakhla-limosud-cars",
};

function pathVariants(path: string): string[] {
  if (path === "/") {
    return ["/"];
  }

  const normalized = path.endsWith("/") ? path.slice(0, -1) : path;
  return [normalized, `${normalized}/`];
}

function pushRedirect(
  redirects: Redirect[],
  source: string,
  destination: string,
) {
  redirects.push({
    source,
    destination,
    permanent: true,
  });
}

function buildLegacyRedirects(): Redirect[] {
  const redirects: Redirect[] = [];

  for (const [legacyPath, destination] of Object.entries(LEGACY_PATH_MAP)) {
    for (const source of pathVariants(legacyPath)) {
      const normalizedSource = source.replace(/\/$/, "") || "/";
      const normalizedDestination = destination.replace(/\/$/, "") || "/";

      // Never redirect a path to itself — that causes ERR_TOO_MANY_REDIRECTS.
      if (normalizedSource !== normalizedDestination) {
        pushRedirect(redirects, source, destination);
      }

      for (const locale of LOCALE_PREFIXES) {
        pushRedirect(redirects, `/${locale}${source}`, destination);
      }
    }
  }

  for (const locale of LOCALE_PREFIXES) {
    pushRedirect(redirects, `/${locale}`, "/");
    pushRedirect(redirects, `/${locale}/`, "/");
    pushRedirect(redirects, `/${locale}/:path*`, "/");
  }

  return redirects;
}

/**
 * 301 redirects for URLs indexed from the previous WordPress site.
 * Add new rows to LEGACY_PATH_MAP when Search Console reports more old paths.
 */
export const legacyRedirects: Redirect[] = buildLegacyRedirects();
