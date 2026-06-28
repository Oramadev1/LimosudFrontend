"use client";

import Image from "next/image";

import { storageUrl } from "@/lib/images";
import { useLookupsQuery } from "@/lib/query/hooks";
import type { LookupRef } from "@/types/api";

type Brand = LookupRef & { is_active?: boolean; image_path?: string | null };

function BrandLogo({ brand }: { brand: Brand }) {
  return (
    <div className="flex h-12 w-[132px] shrink-0 items-center justify-center sm:h-14 sm:w-[156px]">
      {brand.image_path ? (
        <Image
          src={storageUrl(brand.image_path)}
          alt={brand.name}
          width={156}
          height={56}
          className="h-10 w-auto max-h-full max-w-full object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 sm:h-12"
        />
      ) : (
        <span className="text-center text-sm font-semibold tracking-wide text-[#9CA3AF] uppercase">
          {brand.name}
        </span>
      )}
    </div>
  );
}

function BrandTrack({ brands, ariaHidden = false }: { brands: Brand[]; ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 sm:gap-16"
      aria-hidden={ariaHidden || undefined}
    >
      {brands.map((brand) => (
        <BrandLogo key={`${ariaHidden ? "clone-" : ""}${brand.id}`} brand={brand} />
      ))}
    </div>
  );
}

function StaticBrandRow({ brands }: { brands: Brand[] }) {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 sm:gap-x-14">
      {brands.map((brand) => (
        <BrandLogo key={brand.id} brand={brand} />
      ))}
    </div>
  );
}

function BrandMarquee({ brands }: { brands: Brand[] }) {
  const duration = Math.max(28, brands.length * 5);

  return (
    <div className="brand-marquee relative w-full">
      <div
        className="brand-marquee__track flex w-max"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <BrandTrack brands={brands} />
        <BrandTrack brands={brands} ariaHidden />
      </div>
    </div>
  );
}

export function BrandStrip() {
  const { data: lookups, isPending, isError } = useLookupsQuery();
  const brands = lookups?.vehicle_brands ?? [];

  if (isError || (!isPending && brands.length === 0)) {
    return null;
  }

  const useStaticRow = brands.length <= 5;

  return (
    <section className="border-y border-[#E5E5E5] bg-white py-8 dark:bg-white sm:py-10">
      {isPending ? (
        <div className="flex justify-center gap-10 px-6 sm:gap-14">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 w-[132px] animate-pulse rounded bg-[#F0F0F0] sm:h-14 sm:w-[156px]" />
          ))}
        </div>
      ) : useStaticRow ? (
        <StaticBrandRow brands={brands} />
      ) : (
        <BrandMarquee brands={brands} />
      )}
    </section>
  );
}
