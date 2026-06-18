"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import CarCard from "@/components/CarCard";
import CarCardSkeleton from "@/components/CarCardSkeleton";
import FilterSidebar, {
  defaultFilters,
  filterVehicles,
  type FilterState,
} from "@/components/FilterSidebar";
import SearchForm from "@/components/SearchForm";
import { CarGridSkeleton } from "@/components/CarCardSkeleton";
import {
  getMaxVehiclePrice,
  type VehicleFilterState,
} from "@/lib/vehicle-catalog";
import { useAllVehiclesQuery } from "@/lib/query/hooks";
import type { Vehicle } from "@/types/api";

function CarsContent({ vehicles }: { vehicles: Vehicle[] }) {
  const maxPrice = getMaxVehiclePrice(vehicles);
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    maxPrice,
  });
  const [visibleCount, setVisibleCount] = useState(9);
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  useEffect(() => {
    setVisibleCount(9);
  }, [filters, q]);

  const filtered = useMemo(
    () => filterVehicles(vehicles, filters as VehicleFilterState, q),
    [vehicles, filters, q],
  );

  return (
    <div className="flex w-full flex-col gap-6 px-6 py-8 lg:flex-row lg:items-start">
      <FilterSidebar vehicles={vehicles} filters={filters} onChange={setFilters} />

      <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
        <SearchForm />

        {q ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Search results for:{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              &quot;{q}&quot;
            </span>
          </p>
        ) : null}

        {filtered.length === 0 ? (
          <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 py-24 text-center">
            <span className="text-5xl">🚗</span>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No cars found
            </p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
            <button
              type="button"
              onClick={() =>
                setFilters({
                  ...defaultFilters,
                  maxPrice,
                })
              }
              className="mt-2 text-sm font-semibold text-[#3563E9] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="animate-fade-in grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visibleCount).map((vehicle, index) => (
              <CarCard
                key={vehicle.id}
                vehicle={vehicle}
                index={index}
                priority={index < 6}
              />
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-2 flex justify-center">
            {visibleCount < filtered.length ? (
              <button
                type="button"
                onClick={() => setVisibleCount(filtered.length)}
                className="rounded-[4px] bg-[#3563E9] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2a52c9]"
              >
                Show more car
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                Showing all {filtered.length} cars
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function CarsCatalog() {
  const { data: vehicles = [], isPending, isError } = useAllVehiclesQuery();

  if (isPending) {
    return (
      <div className="flex w-full flex-col gap-6 px-6 py-8 lg:flex-row lg:items-start">
        <div className="h-64 w-full shrink-0 animate-pulse rounded-[10px] bg-white lg:w-[260px] dark:bg-gray-900" />
        <div className="grid w-full flex-1 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <CarGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <span className="text-5xl">🚗</span>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Could not load vehicles
        </p>
        <p className="text-sm text-gray-400">Please refresh the page and try again.</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-col gap-6 px-6 py-8 lg:flex-row lg:items-start">
          <div className="h-64 w-full shrink-0 animate-pulse rounded-[10px] bg-white lg:w-[260px] dark:bg-gray-900" />
          <div className="grid w-full flex-1 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        </div>
      }
    >
      <CarsContent vehicles={vehicles} />
    </Suspense>
  );
}
