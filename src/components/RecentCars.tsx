import Link from "next/link";

import CarCard from "@/components/CarCard";
import type { Vehicle } from "@/types/api";

function CarSection({
  title,
  vehicles,
}: {
  title: string;
  vehicles: Vehicle[];
}) {
  if (vehicles.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400">{title}</h2>
        <Link href="/cars" className="text-sm font-semibold text-[#3563E9] hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle, index) => (
          <CarCard key={vehicle.id} vehicle={vehicle} index={index} />
        ))}
      </div>
    </section>
  );
}

export default function RecentCars({
  vehicles,
  currentSlug,
}: {
  vehicles: Vehicle[];
  currentSlug: string;
}) {
  const others = vehicles.filter((vehicle) => vehicle.slug !== currentSlug);
  const recentCars = others.slice(0, 3);
  const recommendationCars = others.slice(3, 6);

  if (recentCars.length === 0 && recommendationCars.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <CarSection title="Recent Car" vehicles={recentCars} />
      <CarSection title="Recommendation Car" vehicles={recommendationCars} />
    </div>
  );
}
