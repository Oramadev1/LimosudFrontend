"use client";

import Image from "next/image";

import { storageUrl } from "@/lib/images";
import { useLookupsQuery } from "@/lib/query/hooks";

export function BrandStrip() {
  const { data: lookups, isPending, isError } = useLookupsQuery();
  const brands = lookups?.vehicle_brands ?? [];

  if (isError || (!isPending && brands.length === 0)) {
    return null;
  }

  const marqueeBrands = brands.length > 0 ? [...brands, ...brands] : [];

  return (
    <section className="overflow-hidden border-y border-[#E5E5E5] bg-white py-6">
      {isPending ? (
        <div className="flex justify-center gap-10 px-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-8 w-24 animate-pulse rounded bg-[#F0F0F0]" />
          ))}
        </div>
      ) : (
        <div className="flex animate-marquee items-center gap-16 whitespace-nowrap">
          {marqueeBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex h-10 min-w-[120px] items-center justify-center"
            >
              {brand.image_path ? (
                <Image
                  src={storageUrl(brand.image_path)}
                  alt={brand.name}
                  width={140}
                  height={40}
                  className="h-8 w-auto max-w-[140px] object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <span className="text-sm font-semibold tracking-wider text-[#888] uppercase">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
