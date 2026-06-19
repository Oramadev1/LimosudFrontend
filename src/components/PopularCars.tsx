import Link from "next/link";

import { routes } from "@/config/routes";
import type { Vehicle } from "@/types/api";

import CarCard from "./CarCard";

export default function PopularCars({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400">Popular Car</h2>
        <Link
          href={routes.vehicles}
          className="text-sm font-semibold text-[#3563E9] hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {vehicles.map((vehicle, index) => (
          <CarCard
            key={vehicle.id}
            vehicle={vehicle}
            index={index}
            priority={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
