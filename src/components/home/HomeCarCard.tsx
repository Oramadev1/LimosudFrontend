"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { formatMarketingPrice } from "@/lib/marketing/vehicles";
import { routes } from "@/config/routes";
import { VehicleImagePlaceholder } from "@/components/VehicleImagePlaceholder";
import type { MarketingCar } from "@/types/marketing";

function carSubtitle(car: MarketingCar): string {
  const parts = [car.brand, car.model, String(car.year)].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : (car.category ?? "");
}

export function HomeCarCard({ car }: { car: MarketingCar }) {
  const href = car.href ?? routes.vehicles;
  const priceLabel = formatMarketingPrice(car);
  const subtitle = carSubtitle(car);

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white"
    >
      <div className="relative h-[190px] w-full overflow-hidden">
        {car.image ? (
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-contain p-2"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <VehicleImagePlaceholder label="Photo à venir" />
        )}
        {car.isFeatured ? (
          <span className="absolute top-3 left-3 rounded-full bg-[#E8192C] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
            Vedette
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">{car.name}</h3>

        {subtitle ? <p className="mt-1 text-xs text-[#888]">{subtitle}</p> : null}

        <div className="mt-3 flex flex-wrap gap-2">
          {[`${car.seats} places`, car.fuel, car.transmission].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#E5E5E5] bg-[#F5F5F5] px-3 py-1 text-xs text-[#555]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#E5E5E5] pt-3">
          <div>
            <span className="text-lg font-bold text-[#1A1A1A]">{priceLabel}</span>
            {car.priceUnit ? (
              <span className="ml-0.5 text-xs text-[#888]">{car.priceUnit}</span>
            ) : null}
          </div>
          <Link
            href={href}
            className="rounded bg-[#1C1C2E] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-80"
          >
            Voir plus
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
