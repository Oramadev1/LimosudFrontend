import {
  getVehicleAvailabilityInfo,
  vehicleAvailabilityBadgeClass,
} from "@/lib/vehicle-availability";
import type { Vehicle } from "@/types/api";

export function VehicleAvailabilityBadge({ vehicle }: { vehicle: Vehicle }) {
  const availability = getVehicleAvailabilityInfo(vehicle);

  if (availability.tone === "available") {
    return null;
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${vehicleAvailabilityBadgeClass(availability.tone)}`}
    >
      {availability.label}
    </span>
  );
}
