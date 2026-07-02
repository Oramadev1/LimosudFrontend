"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { routes } from "@/config/routes";
import type { MarketingCar } from "@/types/marketing";

import { HomeCarCard } from "./HomeCarCard";

export function ServicesSection({ rentCars }: { rentCars: MarketingCar[] }) {
  const t = useTranslations("home");

  return (
    <section className="bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">
          {t("fleetTitle")}
        </h2>

        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold tracking-wide text-[#1A1A1A] uppercase">{t("rental")}</h3>
          <Link
            href={routes.vehicles}
            className="flex items-center gap-1 text-sm text-[#666] transition hover:text-[#1A1A1A]"
          >
            {t("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rentCars.map((car) => (
            <HomeCarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
