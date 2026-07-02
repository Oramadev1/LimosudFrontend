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

export default function HomePageClient({ blogSection }: { blogSection?: React.ReactNode }) {
  const t = useTranslations("home");
  const { data: vehicles = [], isPending, isError } = useAllVehiclesQuery();

  const rentCars = vehicles.slice(0, 6).map((vehicle) => vehicleToMarketingCar(vehicle));

  return (
    <div className="min-w-0 bg-[#F5F5F5]">
      <HeroSection />

      <BrandStrip />

      {isPending ? (
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
        <ServicesSection rentCars={rentCars} />
      )}

      <WhyChooseUsSection />
      {blogSection}
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}
