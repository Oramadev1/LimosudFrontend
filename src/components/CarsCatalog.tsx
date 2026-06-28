"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CarCard from "@/components/CarCard";
import CarCardSkeleton from "@/components/CarCardSkeleton";
import FilterSidebar, {
  defaultFilters,
  filterVehicles,
  type FilterState,
} from "@/components/FilterSidebar";
import SearchForm from "@/components/SearchForm";
import { CarGridSkeleton } from "@/components/CarCardSkeleton";
import { routes } from "@/config/routes";
import { formatDateTime, combineDatetime } from "@/lib/format";
import { rentalSearchFromQuery } from "@/lib/rental-search";
import {
  getMaxVehiclePrice,
  type VehicleFilterState,
} from "@/lib/vehicle-catalog";
import { useAllVehiclesQuery } from "@/lib/query/hooks";
import type { Vehicle } from "@/types/api";

function RentalSummary() {
  const searchParams = useSearchParams();
  const rental = rentalSearchFromQuery(searchParams);

  const summary = useMemo(() => {
    if (!rental.pickupDate || !rental.pickupTime || !rental.dropoffDate || !rental.dropoffTime) {
      return null;
    }

    const start = combineDatetime(rental.pickupDate, rental.pickupTime);
    const end = combineDatetime(rental.dropoffDate, rental.dropoffTime);

    if (!start || !end) {
      return null;
    }

    return {
      start: formatDateTime(start.replace(" ", "T")),
      end: formatDateTime(end.replace(" ", "T")),
    };
  }, [rental.dropoffDate, rental.dropoffTime, rental.pickupDate, rental.pickupTime]);

  if (!summary) {
    return null;
  }

  return (
    <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
      Showing cars for your rental period:{" "}
      <span className="font-semibold">{summary.start}</span> to{" "}
      <span className="font-semibold">{summary.end}</span>
    </p>
  );
}

function parseMinSeats(value: string | null): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const seats = Number(value);
  return Number.isFinite(seats) && seats > 0 ? seats : undefined;
}

function parseMaxPrice(value: string | null): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const price = Number(value);
  return Number.isFinite(price) && price > 0 ? price : undefined;
}

function CarsContent({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const maxPrice = getMaxVehiclePrice(vehicles);
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
  const minSeats = parseMinSeats(searchParams.get("seats"));
  const maxPriceFromUrl = parseMaxPrice(searchParams.get("max_price"));

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    maxPrice: maxPriceFromUrl ?? maxPrice,
    minSeats,
  }));
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      maxPrice: maxPriceFromUrl ?? maxPrice,
      minSeats,
    }));
  }, [maxPrice, maxPriceFromUrl, minSeats]);

  useEffect(() => {
    setVisibleCount(9);
  }, [filters, q]);

  function clearFilters() {
    router.replace(routes.vehicles);
    setFilters({
      ...defaultFilters,
      maxPrice,
    });
  }

  const filtered = useMemo(
    () => filterVehicles(vehicles, filters as VehicleFilterState, q),
    [vehicles, filters, q],
  );

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start">
      <FilterSidebar vehicles={vehicles} filters={filters} onChange={setFilters} />

      <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white dark:bg-white" />}>
          <SearchForm />
        </Suspense>

        <Suspense fallback={null}>
          <RentalSummary />
        </Suspense>

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
              onClick={clearFilters}
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
      <div className="flex w-full min-w-0 max-w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start">
        <div className="h-64 w-full shrink-0 animate-pulse rounded-[10px] bg-white dark:bg-white lg:w-[260px]" />
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
        <div className="flex w-full min-w-0 max-w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start">
          <div className="h-64 w-full shrink-0 animate-pulse rounded-[10px] bg-white dark:bg-white lg:w-[260px]" />
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
