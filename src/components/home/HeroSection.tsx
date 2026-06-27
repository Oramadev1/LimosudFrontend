"use client";

import { Suspense } from "react";
import Image from "next/image";

import SearchForm from "@/components/SearchForm";
import { heroStats, siteConfig } from "@/config/site";

function HeroCopy() {
  return (
    <div className="animate-fade-in-left max-w-xl">
      <h1 className="text-3xl leading-tight font-extrabold text-white drop-shadow-md sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
        Louez des voitures
        <br />
        <span className="text-[#FF6B6B]">de confiance</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/95 drop-shadow sm:text-base">
        {siteConfig.description}
      </p>

      <div className="mt-6 flex gap-8 sm:mt-8 sm:gap-10">
        {heroStats.map((stat) => (
          <div key={stat.label}>
            <span className="text-xl font-bold text-white drop-shadow sm:text-2xl">{stat.value}</span>
            <p className="mt-0.5 text-xs text-white/85">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSearchForm() {
  return (
    <Suspense
      fallback={
        <div
          className="h-56 w-full animate-pulse rounded-2xl bg-white/90 shadow-xl"
          aria-hidden="true"
        />
      }
    >
      <SearchForm
        id="hero-search"
        className="shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:bg-white dark:border-white/20"
      />
    </Suspense>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full lg:min-h-[640px] xl:min-h-[700px]">
        <Image
          src={siteConfig.heroBanner}
          alt="Limosud Cars — location de voitures à Dakhla"
          width={1920}
          height={720}
          priority
          className="h-auto w-full lg:absolute lg:inset-0 lg:h-full lg:w-full lg:object-cover lg:object-center"
          sizes="100vw"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-black/55 lg:via-black/25 lg:to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-44 sm:pb-10 lg:inset-0 lg:flex lg:items-center lg:pb-12 lg:pt-[116px]">
          <div className="pointer-events-auto mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-2 lg:items-end lg:gap-10">
            <HeroCopy />
            <div className="animate-fade-in-up w-full min-w-0 lg:max-w-none">
              <HeroSearchForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
