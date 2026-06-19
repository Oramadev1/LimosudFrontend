"use client";

import HomeHero from "@/components/HomeHero";
import PopularCars from "@/components/PopularCars";
import RecommendationCars from "@/components/RecommendationCars";
import { CarGridSkeleton } from "@/components/CarCardSkeleton";
import { useAllVehiclesQuery } from "@/lib/query/hooks";

export default function HomePageClient() {
  const { data: vehicles = [], isPending, isError } = useAllVehiclesQuery();

  const popular = vehicles.filter((vehicle) => vehicle.is_featured).slice(0, 4);
  const featured =
    popular.length > 0 ? popular : vehicles.slice(0, Math.min(4, vehicles.length));
  const recommendations = vehicles
    .filter((vehicle) => !featured.some((item) => item.id === vehicle.id))
    .slice(0, 8);

  return (
    <div className="w-full min-w-0 max-w-full px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-8 lg:gap-10">
        <HomeHero />

        {isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            <CarGridSkeleton count={4} />
          </div>
        ) : isError ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Could not load vehicles. Please refresh the page.
          </p>
        ) : (
          <>
            {featured.length > 0 ? <PopularCars vehicles={featured} /> : null}
            {recommendations.length > 0 ? (
              <RecommendationCars vehicles={recommendations} />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
