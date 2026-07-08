"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import StorageImage from "@/components/StorageImage";
import { VehicleAvailabilityBadge } from "@/components/VehicleAvailabilityBadge";
import { formatCurrency } from "@/lib/format";
import { getVehicleAvailabilityInfo } from "@/lib/vehicle-availability";
import { vehiclePhotoUrl } from "@/lib/images";
import {
  getVehicleCategoryLabel,
  getVehicleFuelLabel,
  getVehicleTransmissionLabel,
} from "@/lib/vehicle-catalog";
import type { Locale } from "@/i18n/config";
import type { Vehicle } from "@/types/api";

import RentNowButton from "./RentNowButton";
import { VehicleImagePlaceholder } from "./VehicleImagePlaceholder";

export default function VehicleDetailPanel({ vehicle }: { vehicle: Vehicle }) {
  const t = useTranslations("vehicle");
  const locale = useLocale() as Locale;
  const [activeThumb, setActiveThumb] = useState(0);

  const images = useMemo(() => {
    if (!vehicle.photos?.length) {
      return [];
    }

    return [...vehicle.photos]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((photo) => vehiclePhotoUrl(photo.path));
  }, [vehicle]);

  const heroImage = images[activeThumb] ?? images[0];
  const price = parseFloat(vehicle.daily_price);
  const availability = getVehicleAvailabilityInfo(vehicle);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex shrink-0 flex-col gap-4 lg:w-[380px]">
        <div className="relative h-[280px] w-full overflow-hidden rounded-[10px] bg-gray-50">
          {heroImage ? (
            <StorageImage
              src={heroImage}
              alt={vehicle.name}
              fill
              priority
              className="object-contain p-2"
            />
          ) : (
            <VehicleImagePlaceholder label={t("photoComingSoon")} />
          )}
        </div>

        <div
          className="flex gap-3 overflow-x-auto pb-1"
          role="tablist"
          aria-label={t("photosAria")}
        >
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              role="tab"
              aria-selected={activeThumb === index}
              aria-label={t("viewImage", { index: index + 1 })}
              onClick={() => setActiveThumb(index)}
              className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[8px] border-2 bg-white transition-colors ${
                activeThumb === index
                  ? "border-[#3563E9]"
                  : "border-transparent"
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

      <div className="flex flex-1 flex-col gap-4 rounded-[10px] border border-transparent bg-white p-6 dark:bg-white">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {vehicle.name}
            </h1>
            <VehicleAvailabilityBadge vehicle={vehicle} />
          </div>
          {!availability.rentable ? (
            <p className="mt-2 text-sm font-medium text-red-500">
              {t(availability.labelKey)}
            </p>
          ) : availability.tone === "rented" ? (
            <p className="mt-2 text-sm font-medium text-amber-600">
              {t("unavailableRented")}
            </p>
          ) : availability.tone === "reserved" ? (
            <p className="mt-2 text-sm font-medium text-amber-600">
              {t("unavailableReserved")}
            </p>
          ) : null}
        </div>

        <p className="text-sm leading-relaxed text-gray-400">
          {vehicle.description ||
            t("rentDescription", {
              name: vehicle.name,
              fuel: getVehicleFuelLabel(vehicle).toLowerCase(),
              transmission: getVehicleTransmissionLabel(vehicle).toLowerCase(),
            })}
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {vehicle.brand ? (
            <div className="flex justify-between">
              <span className="text-gray-400">{t("brand")}</span>
              <span className="font-semibold text-gray-700">
                {vehicle.brand.name}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span className="text-gray-400">{t("model")}</span>
            <span className="font-semibold text-gray-700">
              {vehicle.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{t("type")}</span>
            <span className="font-semibold text-gray-700">
              {getVehicleCategoryLabel(vehicle)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{t("capacity")}</span>
            <span className="font-semibold text-gray-700">
              {vehicle.seats} {t("seats")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{t("doors")}</span>
            <span className="font-semibold text-gray-700">
              {vehicle.doors}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{t("transmission")}</span>
            <span className="font-semibold text-gray-700">
              {getVehicleTransmissionLabel(vehicle)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{t("fuel")}</span>
            <span className="font-semibold text-gray-700">
              {getVehicleFuelLabel(vehicle)}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(price, locale)}
            </span>
            <span className="text-sm text-gray-400"> {t("perDay")}</span>
          </div>
          <RentNowButton slug={vehicle.slug} large disabled={!availability.rentable} />
        </div>
      </div>
    </div>
  );
}
