import type { PublicLookups, Vehicle } from "@/types/api";

export interface VehicleFilters {
  brand?: string;
  category?: string;
  transmission?: string;
  fuel?: string;
}

export function filterVehicles(
  vehicles: Vehicle[],
  filters: VehicleFilters,
): Vehicle[] {
  return vehicles.filter((vehicle) => {
    if (filters.brand && vehicle.brand?.slug !== filters.brand) {
      return false;
    }

    if (filters.category && vehicle.category?.slug !== filters.category) {
      return false;
    }

    if (
      filters.transmission &&
      vehicle.transmission_type?.slug !== filters.transmission
    ) {
      return false;
    }

    if (filters.fuel && vehicle.fuel_type?.slug !== filters.fuel) {
      return false;
    }

    return true;
  });
}

export function getFilterOptions(lookups: PublicLookups) {
  return {
    brands: lookups.vehicle_brands.filter((brand) => brand.is_active),
    categories: lookups.vehicle_categories.filter(
      (category) => category.is_active,
    ),
    transmissions: lookups.transmission_types,
    fuels: lookups.fuel_types,
  };
}
