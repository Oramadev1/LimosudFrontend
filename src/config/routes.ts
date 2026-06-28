export const routes = {
  home: "/",
  vehicles: "/vehicles",
  vehicle: (slug: string) => `/vehicles/${slug}`,
  blog: "/blog",
  about: "/about",
  blogPost: (slug: string) => `/blog/${slug}`,
  terms: "/terms",
  book: (slug: string, query = "") =>
    query ? `/book/${slug}?${query}` : `/book/${slug}`,
} as const;
