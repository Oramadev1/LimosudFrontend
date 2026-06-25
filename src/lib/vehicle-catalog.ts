import type { Vehicle } from "@/types/api";

import { getVehicleImageUrl } from "./images";
import { pickPublicCarImage, PUBLIC_CAR_IMAGES } from "./public-car-images";

export const CAPACITY_BUCKETS = [2, 4, 6, 8] as const;

export type VehicleFilterState = {
  types: string[];
  caps: number[];
  maxPrice: number;
  /** Minimum seats from URL search (homepage hero). */
  minSeats?: number;
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
  const price = parseFloat(vehicle.daily_price);
  return Number.isFinite(price) ? price : 0;
}

export function getVehicleSeats(vehicle: Vehicle): number {
  const seats = Number(vehicle.seats);
  return Number.isFinite(seats) ? seats : 0;
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
    const seats = getVehicleSeats(vehicle);

    const typeOk =
      filters.types.length === 0 || filters.types.includes(category);
    const capOk =
      filters.caps.length === 0 ||
      filters.caps.some((cap) => vehicleMatchesCapacity(vehicle, cap));
    const minSeatsOk =
      filters.minSeats == null || seats >= filters.minSeats;
    const priceOk = price <= filters.maxPrice;
    const nameOk =
      !q ||
      vehicle.name.toLowerCase().includes(q) ||
      vehicle.model.toLowerCase().includes(q) ||
      (vehicle.brand?.name?.toLowerCase().includes(q) ?? false);

    return typeOk && capOk && minSeatsOk && priceOk && nameOk;
  });
}

/** Seat ranges aligned with sidebar labels (2 / 4 / 6 / 8+). */
export function vehicleMatchesCapacity(vehicle: Vehicle, cap: number): boolean {
  const seats = getVehicleSeats(vehicle);

  if (cap === 2) {
    return seats <= 2;
  }
  if (cap === 4) {
    return seats >= 3 && seats <= 5;
  }
  if (cap === 6) {
    return seats >= 6 && seats <= 7;
  }
  if (cap === 8) {
    return seats >= 8;
  }

  return false;
}

export function vehicleCardImage(vehicle: Vehicle): string {
  return getVehicleImageUrl(vehicle) ?? pickPublicCarImage(vehicle.id, PUBLIC_CAR_IMAGES);
}
