import Link from "next/link";

import { routes } from "@/config/routes";
import type { Vehicle } from "@/types/api";

import CarCard from "./CarCard";

export default function RecommendationCars({
  vehicles,
}: {
  vehicles: Vehicle[];
}) {
  return (
    <section>
      <h2 className="mb-5 text-sm font-medium text-gray-400">Recommendation Car</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {vehicles.map((vehicle, index) => (
          <CarCard key={vehicle.id} vehicle={vehicle} index={index} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          href={routes.vehicles}
          className="rounded-[4px] bg-[#3563E9] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2a52c9]"
        >
          Show more car
        </Link>
      </div>
    </section>
  );
}
