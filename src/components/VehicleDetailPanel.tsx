"use client";

import { useMemo, useState } from "react";

import StorageImage from "@/components/StorageImage";
import { formatCurrency } from "@/lib/format";
import { vehiclePhotoUrl } from "@/lib/images";
import {
  getVehicleCategoryLabel,
  getVehicleFuelLabel,
  getVehicleTransmissionLabel,
  vehicleCardImage,
} from "@/lib/vehicle-catalog";
import type { Vehicle } from "@/types/api";

import RentNowButton from "./RentNowButton";

export default function VehicleDetailPanel({ vehicle }: { vehicle: Vehicle }) {
  const [activeThumb, setActiveThumb] = useState(0);

  const images = useMemo(() => {
    const photos = vehicle.photos?.length
      ? [...vehicle.photos]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((photo) => vehiclePhotoUrl(photo.path))
      : [];

    const fallback = vehicleCardImage(vehicle);
    if (photos.length === 0 && fallback) {
      return [fallback, fallback, fallback];
    }

    if (photos.length === 1) {
      return [photos[0], photos[0], photos[0]];
    }

    return photos.slice(0, 3);
  }, [vehicle]);

  const heroImage = images[activeThumb] ?? images[0];
  const price = parseFloat(vehicle.daily_price);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex shrink-0 flex-col gap-4 lg:w-[380px]">
        <div className="relative flex h-[240px] w-full items-end justify-center overflow-hidden rounded-[10px] bg-gradient-to-br from-[#1C3FA8] to-[#3563E9] px-6 pt-6">
          <p className="absolute top-6 left-6 max-w-[160px] text-xl leading-tight font-bold text-white">
            {vehicle.description?.slice(0, 80) ||
              "Premium rental with transparent pricing and flexible pickup."}
          </p>
          {heroImage ? (
            <div className="relative h-[130px] w-full">
              <StorageImage
                src={heroImage}
                alt={vehicle.name}
                fill
                priority
                className="object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          ) : null}
        </div>

        <div className="flex gap-3" role="tablist" aria-label="Vehicle photos">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              role="tab"
              aria-selected={activeThumb === index}
              aria-label={`View image ${index + 1}`}
              onClick={() => setActiveThumb(index)}
              className={`relative h-[72px] flex-1 overflow-hidden rounded-[8px] border-2 bg-white transition-colors dark:bg-gray-800 ${
                activeThumb === index
                  ? "border-[#3563E9]"
                  : "border-transparent dark:border-gray-700"
              }`}
            >
              <StorageImage
                src={src}
                alt=""
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 rounded-[10px] border border-transparent bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {vehicle.name}
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            {getVehicleCategoryLabel(vehicle)}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-gray-400">
          {vehicle.description ||
            `Rent the ${vehicle.name} with ${getVehicleFuelLabel(vehicle).toLowerCase()} fuel and ${getVehicleTransmissionLabel(vehicle).toLowerCase()} transmission.`}
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Type Car</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {getVehicleCategoryLabel(vehicle)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Capacity</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {vehicle.seats} Person
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Steering</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {getVehicleTransmissionLabel(vehicle)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Gasoline</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {getVehicleFuelLabel(vehicle)}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(price)}
            </span>
            <span className="text-sm text-gray-400"> / day</span>
          </div>
          <RentNowButton slug={vehicle.slug} large />
        </div>
      </div>
    </div>
  );
}
