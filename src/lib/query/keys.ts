export const queryKeys = {
  vehicles: ["public", "vehicles"] as const,
  vehicle: (slug: string) => ["public", "vehicle", slug] as const,
  locations: ["public", "locations"] as const,
  lookups: ["public", "lookups"] as const,
};
