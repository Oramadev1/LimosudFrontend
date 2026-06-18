import Link from "next/link";

import StorageImage from "@/components/StorageImage";
import { formatCurrency } from "@/lib/format";
import {
  getVehicleCategoryLabel,
  getVehicleFuelLabel,
  getVehicleTransmissionLabel,
  vehicleCardImage,
} from "@/lib/vehicle-catalog";
import type { Vehicle } from "@/types/api";

import RentNowButton from "./RentNowButton";

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

  return (
    <div
      style={{ animationDelay: `${index * 0.07}s` }}
      data-testid="car-card"
      className="animate-fade-in-up flex cursor-pointer flex-col gap-4 rounded-[10px] border border-transparent bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(53,99,233,0.12)] dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between">
        <Link
          href={`/cars/${vehicle.slug}`}
          className="min-w-0 hover:underline"
        >
          <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">
            {vehicle.name}
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {getVehicleCategoryLabel(vehicle)}
          </span>
        </Link>
      </div>

      <Link
        href={`/cars/${vehicle.slug}`}
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
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <span className="text-xs text-gray-300">No Image</span>
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>⛽ {getVehicleFuelLabel(vehicle)}</span>
        <span>⚙️ {getVehicleTransmissionLabel(vehicle)}</span>
        <span>👤 {vehicle.seats} People</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-bold text-gray-900 dark:text-white">
            {formatCurrency(price)}
            <span className="text-xs font-normal text-gray-400">/day</span>
          </div>
        </div>
        <RentNowButton slug={vehicle.slug} />
      </div>
    </div>
  );
}
