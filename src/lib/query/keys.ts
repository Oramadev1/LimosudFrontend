export const queryKeys = {
  vehicles: ["public", "vehicles"] as const,
  vehicle: (slug: string) => ["public", "vehicle", slug] as const,
  vehicleSchedule: (vehicleId: number) => ["public", "vehicle-schedule", vehicleId] as const,
  locations: ["public", "locations"] as const,
  lookups: ["public", "lookups"] as const,
};
