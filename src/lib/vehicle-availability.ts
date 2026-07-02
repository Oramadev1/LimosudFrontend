import type { Vehicle } from "@/types/api";

export type VehicleAvailabilityTone = "available" | "reserved" | "rented" | "unavailable";

export type VehicleStatusLabelKey =
  | "available"
  | "unavailableRented"
  | "unavailableReserved"
  | "unavailableMaintenance"
  | "unavailableDefault";

export type VehicleAvailabilityInfo = {
  rentable: boolean;
  tone: VehicleAvailabilityTone;
  labelKey: VehicleStatusLabelKey;
};

export function getVehicleStatusLabelKey(vehicle: Vehicle): VehicleStatusLabelKey {
  const slug = vehicle.status?.slug ?? "available";

  switch (slug) {
    case "rented":
      return "unavailableRented";
    case "reserved":
      return "unavailableReserved";
    case "maintenance":
    case "repair":
      return "unavailableMaintenance";
    case "out_of_service":
      return "unavailableDefault";
    case "available":
    default:
      return "available";
  }
}

export function getVehicleAvailabilityInfo(vehicle: Vehicle): VehicleAvailabilityInfo {
  const slug = vehicle.status?.slug ?? "available";
  const labelKey = getVehicleStatusLabelKey(vehicle);

  switch (slug) {
    case "rented":
      return { rentable: true, tone: "rented", labelKey };
    case "reserved":
      return { rentable: true, tone: "reserved", labelKey };
    case "maintenance":
    case "repair":
      return { rentable: false, tone: "unavailable", labelKey };
    case "out_of_service":
      return { rentable: false, tone: "unavailable", labelKey };
    case "available":
    default:
      return { rentable: true, tone: "available", labelKey };
  }
}

export function vehicleAvailabilityBadgeClass(tone: VehicleAvailabilityTone): string {
  switch (tone) {
    case "rented":
      return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";
    case "reserved":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300";
    case "unavailable":
      return "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300";
  }
}
