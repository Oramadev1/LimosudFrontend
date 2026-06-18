import type { Vehicle } from "@/types/api";

import { getVehicleImageUrl } from "./images";

export const CAPACITY_BUCKETS = [2, 4, 6, 8] as const;

export type VehicleFilterState = {
  types: string[];
  caps: number[];
  maxPrice: number;
};

export const defaultVehicleFilters: VehicleFilterState = {
  types: [],
  caps: [],
  maxPrice: 5000,
};

export function getVehicleCategoryLabel(vehicle: Vehicle): string {
  return vehicle.category?.name ?? vehicle.brand?.name ?? "Vehicle";
}

export function getVehicleTransmissionLabel(vehicle: Vehicle): string {
  return vehicle.transmission_type?.name ?? "—";
}

export function getVehicleFuelLabel(vehicle: Vehicle): string {
  return vehicle.fuel_type?.name ?? "—";
}

export function getVehicleDailyPrice(vehicle: Vehicle): number {
  return parseFloat(vehicle.daily_price);
}

export function getVehicleFilterTypes(vehicles: Vehicle[]): string[] {
  return [...new Set(vehicles.map(getVehicleCategoryLabel))].sort();
}

export function getMaxVehiclePrice(vehicles: Vehicle[]): number {
  if (vehicles.length === 0) {
    return defaultVehicleFilters.maxPrice;
  }

  return Math.ceil(Math.max(...vehicles.map(getVehicleDailyPrice)));
}

export function filterVehicles(
  vehicles: Vehicle[],
  filters: VehicleFilterState,
  query = "",
): Vehicle[] {
  const q = query.trim().toLowerCase();

  return vehicles.filter((vehicle) => {
    const category = getVehicleCategoryLabel(vehicle);
    const price = getVehicleDailyPrice(vehicle);
    const seats = vehicle.seats;

    const typeOk =
      filters.types.length === 0 || filters.types.includes(category);
    const capOk =
      filters.caps.length === 0 ||
      filters.caps.some((cap) => (cap === 8 ? seats >= 8 : seats === cap));
    const priceOk = price <= filters.maxPrice;
    const nameOk =
      !q ||
      vehicle.name.toLowerCase().includes(q) ||
      vehicle.model.toLowerCase().includes(q) ||
      vehicle.brand?.name.toLowerCase().includes(q);

    return typeOk && capOk && priceOk && nameOk;
  });
}

export function vehicleMatchesCapacity(vehicle: Vehicle, cap: number): boolean {
  return cap === 8 ? vehicle.seats >= 8 : vehicle.seats === cap;
}

export function vehicleCardImage(vehicle: Vehicle): string | undefined {
  return getVehicleImageUrl(vehicle) ?? undefined;
}
