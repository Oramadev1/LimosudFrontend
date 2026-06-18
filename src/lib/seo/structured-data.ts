import { siteConfig } from "@/config/site";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    ...(siteConfig.contactEmail
      ? { email: siteConfig.contactEmail }
      : {}),
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    ...(siteConfig.contactEmail
      ? { email: siteConfig.contactEmail }
      : {}),
  };
}
