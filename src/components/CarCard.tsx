import Link from "next/link";

import StorageImage from "@/components/StorageImage";
import { VehicleAvailabilityBadge } from "@/components/VehicleAvailabilityBadge";
import { routes } from "@/config/routes";
import { formatCurrency } from "@/lib/format";
import { getVehicleAvailabilityInfo } from "@/lib/vehicle-availability";
import {
  getVehicleCategoryLabel,
  getVehicleFuelLabel,
  getVehicleTransmissionLabel,
  vehicleCardImage,
} from "@/lib/vehicle-catalog";
import type { Vehicle } from "@/types/api";

import RentNowButton from "./RentNowButton";
import { VehicleImagePlaceholder } from "./VehicleImagePlaceholder";

interface CarCardProps {
  vehicle: Vehicle;
  index?: number;
  priority?: boolean;
}

export default function CarCard({
  vehicle,
  index = 0,
  priority = false,
}: CarCardProps) {
  const image = vehicleCardImage(vehicle);
  const price = parseFloat(vehicle.daily_price);
  const availability = getVehicleAvailabilityInfo(vehicle);

  return (
    <div
      style={{ animationDelay: `${index * 0.07}s` }}
      data-testid="car-card"
      className={`animate-fade-in-up flex flex-col gap-4 rounded-[10px] border bg-white p-5 transition-all duration-300 dark:bg-white ${
        availability.rentable
          ? "cursor-pointer border-transparent hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(53,99,233,0.12)]"
          : "border-gray-100 opacity-95"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={routes.vehicle(vehicle.slug)}
          className="min-w-0 hover:underline"
        >
          <h3 className="truncate text-base font-bold text-gray-900">
            {vehicle.name}
          </h3>
          <span className="text-xs text-gray-400">
            {[vehicle.brand?.name, getVehicleCategoryLabel(vehicle)].filter(Boolean).join(" · ")}
          </span>
        </Link>
        <VehicleAvailabilityBadge vehicle={vehicle} />
      </div>

      <Link
        href={routes.vehicle(vehicle.slug)}
        className="relative block h-[120px] w-full overflow-hidden"
      >
        {image ? (
          <StorageImage
            src={image}
            alt={vehicle.name}
            fill
            priority={priority}
            className="object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <VehicleImagePlaceholder />
        )}
      </Link>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>⛽ {getVehicleFuelLabel(vehicle)}</span>
        <span>⚙️ {getVehicleTransmissionLabel(vehicle)}</span>
        <span>👤 {vehicle.seats} People</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-bold text-gray-900">
            {formatCurrency(price)}
            <span className="text-xs font-normal text-gray-400">/day</span>
          </div>
        </div>
        <RentNowButton slug={vehicle.slug} disabled={!availability.rentable} />
      </div>
    </div>
  );
}
