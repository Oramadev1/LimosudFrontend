"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

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
import type { Locale } from "@/i18n/config";

function RentalSummary() {
  const t = useTranslations("catalog");
  const locale = useLocale() as Locale;
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
      start: formatDateTime(start.replace(" ", "T"), locale),
      end: formatDateTime(end.replace(" ", "T"), locale),
    };
  }, [locale, rental.dropoffDate, rental.dropoffTime, rental.pickupDate, rental.pickupTime]);

  if (!summary) {
    return null;
  }

  return (
    <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
      {t("showingPeriod")}{" "}
      <span className="font-semibold">{summary.start}</span> {t("to")}{" "}
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
  const t = useTranslations("catalog");
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
            {t("searchResults")}{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              &quot;{q}&quot;
            </span>
          </p>
        ) : null}

        {filtered.length === 0 ? (
          <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 py-24 text-center">
            <span className="text-5xl">🚗</span>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {t("noCars")}
            </p>
            <p className="text-sm text-gray-400">{t("tryFilters")}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 text-sm font-semibold text-[#3563E9] hover:underline"
            >
              {t("clearFilters")}
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
                {t("showMore")}
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                {t("showingAll", { count: filtered.length })}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function CarsCatalog() {
  const t = useTranslations("catalog");
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
          {t("loadError")}
        </p>
        <p className="text-sm text-gray-400">{t("loadErrorHint")}</p>
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
