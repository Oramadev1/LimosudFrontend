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
    <section className="overflow-hidden border-y border-[#E5E5E5] bg-white py-8 dark:bg-white sm:py-10">
      {isPending ? (
        <div className="flex justify-center gap-12 px-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-14 w-36 animate-pulse rounded bg-[#F0F0F0]" />
          ))}
        </div>
      ) : (
        <div className="flex animate-marquee items-center gap-20 whitespace-nowrap">
          {marqueeBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex h-16 min-w-[160px] items-center justify-center sm:h-20 sm:min-w-[200px]"
            >
              {brand.image_path ? (
                <Image
                  src={storageUrl(brand.image_path)}
                  alt={brand.name}
                  width={220}
                  height={72}
                  className="h-14 w-auto max-w-[200px] object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-16 sm:max-w-[240px]"
                />
              ) : (
                <span className="text-base font-semibold tracking-wider text-[#888] uppercase sm:text-lg">
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
