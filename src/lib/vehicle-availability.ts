import type { Vehicle } from "@/types/api";

export type VehicleAvailabilityTone = "available" | "reserved" | "rented" | "unavailable";

export type VehicleAvailabilityInfo = {
  label: string;
  rentable: boolean;
  tone: VehicleAvailabilityTone;
};

export function getVehicleAvailabilityInfo(vehicle: Vehicle): VehicleAvailabilityInfo {
  const slug = vehicle.status?.slug ?? "available";

  switch (slug) {
    case "rented":
      return {
        label: "Currently rented",
        rentable: false,
        tone: "rented",
      };
    case "reserved":
      return {
        label: "Reserved",
        rentable: true,
        tone: "reserved",
      };
    case "maintenance":
    case "repair":
      return {
        label: "In maintenance",
        rentable: false,
        tone: "unavailable",
      };
    case "out_of_service":
    case "sold":
      return {
        label: "Unavailable",
        rentable: false,
        tone: "unavailable",
      };
    case "available":
    default:
      return {
        label: "Available",
        rentable: true,
        tone: "available",
      };
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
