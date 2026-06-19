export const routes = {
  home: "/",
  vehicles: "/vehicles",
  vehicle: (slug: string) => `/vehicles/${slug}`,
  book: (slug: string, query = "") =>
    query ? `/book/${slug}?${query}` : `/book/${slug}`,
} as const;
