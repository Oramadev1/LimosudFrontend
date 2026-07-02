"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";

import CarCardSkeleton from "@/components/CarCardSkeleton";
import FilterSidebar, {
  defaultFilters,
  filterVehicles,
  type FilterState,
} from "@/components/FilterSidebar";
import RecentCars from "@/components/RecentCars";
import VehicleDetailPanel from "@/components/VehicleDetailPanel";
import { getMaxVehiclePrice } from "@/lib/vehicle-catalog";
import type { Vehicle } from "@/types/api";
import { useAllVehiclesQuery, useVehicleQuery } from "@/lib/query/hooks";

export default function CarDetailPageClient({
  slug,
  initialVehicle,
  initialVehicles = [],
}: {
  slug: string;
  initialVehicle?: Vehicle;
  initialVehicles?: Vehicle[];
}) {
  const {
    data: vehicle,
    isPending: vehiclePending,
    isError: vehicleError,
  } = useVehicleQuery(slug, initialVehicle);
  const { data: allVehicles = [], isPending: listPending } =
    useAllVehiclesQuery(initialVehicles);
  const maxPrice = getMaxVehiclePrice(allVehicles);
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    maxPrice,
  });

  useEffect(() => {
    setFilters((current) => ({ ...current, maxPrice }));
  }, [maxPrice]);

  const filteredVehicles = useMemo(
    () => filterVehicles(allVehicles, filters),
    [allVehicles, filters],
  );

  useEffect(() => {
    if (!vehiclePending && !listPending && (vehicleError || !vehicle)) {
      notFound();
    }
  }, [vehiclePending, listPending, vehicleError, vehicle]);

  if ((vehiclePending && !initialVehicle) || (listPending && !initialVehicles.length)) {
    return (
      <div className="flex w-full flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-start">
        <div className="h-64 w-full shrink-0 animate-pulse rounded-[10px] bg-white dark:bg-white lg:w-[260px]" />
        <div className="flex min-w-0 w-full flex-1 flex-col gap-6">
          <div className="h-[420px] animate-pulse rounded-[10px] bg-white dark:bg-white" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (vehicleError || !vehicle) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6 px-6 py-8 lg:flex-row lg:items-start">
      <FilterSidebar
        vehicles={allVehicles}
        filters={filters}
        onChange={setFilters}
      />
      <div className="flex min-w-0 w-full flex-1 flex-col gap-6">
        <VehicleDetailPanel vehicle={vehicle} />
        <RecentCars vehicles={filteredVehicles} currentSlug={slug} />
      </div>
    </div>
  );
}
