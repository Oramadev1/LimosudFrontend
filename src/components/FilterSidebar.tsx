"use client";

import { useState } from "react";

import {
  CAPACITY_BUCKETS,
  defaultVehicleFilters,
  filterVehicles,
  getMaxVehiclePrice,
  getVehicleCategoryLabel,
  getVehicleDailyPrice,
  getVehicleFilterTypes,
  vehicleMatchesCapacity,
  type VehicleFilterState,
} from "@/lib/vehicle-catalog";
import type { Vehicle } from "@/types/api";

export type FilterState = VehicleFilterState;

interface Props {
  vehicles: Vehicle[];
  filters?: FilterState;
  onChange?: (f: FilterState) => void;
}

export default function FilterSidebar({
  vehicles,
  filters: externalFilters,
  onChange,
}: Props) {
  const maxCatalogPrice = getMaxVehiclePrice(vehicles);
  const [localFilters, setLocalFilters] = useState<FilterState>({
    ...defaultVehicleFilters,
    maxPrice: maxCatalogPrice,
  });
  const filters = externalFilters ?? localFilters;
  const handleChange: (f: FilterState) => void = onChange ?? setLocalFilters;
  const carTypes = getVehicleFilterTypes(vehicles);

  function toggleType(type: string) {
    handleChange({
      ...filters,
      types: filters.types.includes(type)
        ? filters.types.filter((item) => item !== type)
        : [...filters.types, type],
    });
  }

  function toggleCap(cap: number) {
    handleChange({
      ...filters,
      caps: filters.caps.includes(cap)
        ? filters.caps.filter((item) => item !== cap)
        : [...filters.caps, cap],
    });
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-8 self-start rounded-[10px] border border-transparent bg-white p-6 transition-colors lg:w-[260px] dark:border-gray-800 dark:bg-gray-900">
      <div>
        <p className="mb-4 text-xs font-semibold tracking-widest text-gray-300 uppercase">
          Type
        </p>
        <ul className="flex flex-col gap-3">
          {carTypes.map((type) => {
            const count = vehicles.filter(
              (vehicle) => getVehicleCategoryLabel(vehicle) === type,
            ).length;
            const checked = filters.types.includes(type);

            return (
              <li
                key={type}
                className="flex cursor-pointer items-center gap-3"
                onClick={() => toggleType(type)}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${checked ? "border-[#3563E9] bg-[#3563E9]" : "border-gray-300 dark:border-gray-600"}`}
                >
                  {checked ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {type}
                </span>
                <span className="ml-auto text-xs text-gray-300 dark:text-gray-600">
                  ({count})
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="mb-4 text-xs font-semibold tracking-widest text-gray-300 uppercase">
          Capacity
        </p>
        <ul className="flex flex-col gap-3">
          {CAPACITY_BUCKETS.map((cap) => {
            const label = cap === 8 ? "8 or More" : `${cap} Person`;
            const count = vehicles.filter((vehicle) =>
              vehicleMatchesCapacity(vehicle, cap),
            ).length;
            const checked = filters.caps.includes(cap);

            return (
              <li
                key={cap}
                className="flex cursor-pointer items-center gap-3"
                onClick={() => toggleCap(cap)}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${checked ? "border-[#3563E9] bg-[#3563E9]" : "border-gray-300 dark:border-gray-600"}`}
                >
                  {checked ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {label}
                </span>
                <span className="ml-auto text-xs text-gray-300 dark:text-gray-600">
                  ({count})
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="mb-4 text-xs font-semibold tracking-widest text-gray-300 uppercase">
          Price
        </p>
        <input
          type="range"
          min={0}
          max={maxCatalogPrice}
          value={filters.maxPrice}
          onChange={(event) =>
            handleChange({
              ...filters,
              maxPrice: Number(event.target.value),
            })
          }
          className="w-full cursor-pointer accent-[#3563E9]"
        />
        <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Max. {filters.maxPrice.toFixed(0)} MAD/day
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          handleChange({
            ...defaultVehicleFilters,
            maxPrice: maxCatalogPrice,
          })
        }
        className="w-full rounded-[8px] border border-[#3563E9] py-2 text-sm font-semibold text-[#3563E9] transition-colors hover:bg-[#3563E9] hover:text-white"
      >
        Clear All Filters
      </button>
    </aside>
  );
}

export const defaultFilters = defaultVehicleFilters;

export { filterVehicles, getVehicleDailyPrice };
