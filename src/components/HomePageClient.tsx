"use client";

import { BrandStrip } from "@/components/home/BrandStrip";
import { FAQSection } from "@/components/home/FAQSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { CarGridSkeleton } from "@/components/CarCardSkeleton";
import { vehicleToMarketingCar } from "@/lib/marketing/vehicles";
import { useAllVehiclesQuery } from "@/lib/query/hooks";
import { useTranslations } from "next-intl";

export default function HomePageClient({
  blogSection,
  initialVehicles = [],
}: {
  blogSection?: React.ReactNode;
  initialVehicles?: import("@/types/api").Vehicle[];
}) {
  const t = useTranslations("home");
  const { data: vehicles = [], isPending, isError } = useAllVehiclesQuery(initialVehicles);

  const ranked = vehicles
    .filter((vehicle) => vehicle.homepage_rank != null && vehicle.homepage_rank >= 1 && vehicle.homepage_rank <= 6)
    .sort((a, b) => (a.homepage_rank ?? 99) - (b.homepage_rank ?? 99));

  const homeFleet = (ranked.length > 0 ? ranked.slice(0, 6) : vehicles.slice(0, 6)).map((vehicle) =>
    vehicleToMarketingCar(vehicle),
  );

  return (
    <div className="min-w-0 bg-[#F5F5F5]">
      <HeroSection />

      <BrandStrip />

      {isPending && !initialVehicles.length ? (
        <section className="bg-[#F5F5F5] py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <CarGridSkeleton count={3} />
          </div>
        </section>
      ) : isError ? (
        <section className="bg-[#F5F5F5] py-16 text-center text-sm text-[#666]">
          {t("loadVehiclesError")}
        </section>
      ) : (
        <ServicesSection rentCars={homeFleet} />
      )}

      <WhyChooseUsSection />
      {blogSection}
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}
