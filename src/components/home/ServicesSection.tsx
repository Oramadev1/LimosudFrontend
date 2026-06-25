import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/config/routes";
import { pickPublicCarImage, publicCarImageLabel } from "@/lib/public-car-images";
import type { MarketingCar } from "@/types/marketing";

import { HomeCarCard } from "./HomeCarCard";

function showcaseCarsFromImages(images: string[]): MarketingCar[] {
  return images.slice(0, 6).map((image, index) => ({
    id: index + 1,
    name: publicCarImageLabel(image),
    year: 2024,
    image,
    category: "Location",
    seats: 4,
    fuel: "Essence",
    transmission: "Auto",
    price: 350 + index * 50,
    priceUnit: "/day",
    type: "rent",
    href: routes.vehicles,
  }));
}

export function ServicesSection({
  rentCars,
  carImages,
}: {
  rentCars: MarketingCar[];
  carImages: string[];
}) {
  const cars =
    rentCars.length > 0
      ? rentCars.map((car, index) => ({
          ...car,
          image: car.image || pickPublicCarImage(index, carImages),
        }))
      : showcaseCarsFromImages(carImages);

  return (
    <section className="bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">
          Notre flotte
        </h2>

        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-wide text-[#1A1A1A] uppercase">Location</h3>
          <Link
            href={routes.vehicles}
            className="flex items-center gap-1 text-sm text-[#666] transition hover:text-[#1A1A1A]"
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <HomeCarCard key={`${car.id}-${car.image}`} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
