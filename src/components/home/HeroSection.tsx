"use client";

import { Suspense } from "react";
import Image from "next/image";

import SearchForm from "@/components/SearchForm";
import { heroStats, siteConfig } from "@/config/site";

function HeroCopy() {
  return (
    <div className="animate-fade-in-left max-w-2xl">
      <h1 className="text-3xl leading-tight font-extrabold text-white drop-shadow-md sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
        Louez des voitures
        <br />
        <span className="text-[#FF6B6B]">de confiance</span>
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/95 drop-shadow sm:text-base">
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

function HeroSearchFooter() {
  return (
    <Suspense
      fallback={
        <div className="h-40 w-full animate-pulse bg-white/90" aria-hidden="true" />
      }
    >
      <SearchForm id="hero-search" variant="heroFooter" />
    </Suspense>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[560px] w-full sm:min-h-[620px] lg:min-h-[680px]">
        <Image
          src={siteConfig.heroBanner}
          alt="Limosud Cars — location de voitures à Dakhla"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/50"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[inherit] flex-col justify-between pt-[116px]">
          <div className="px-6 pb-6 pt-2">
            <div className="mx-auto w-full max-w-[1200px]">
              <HeroCopy />
            </div>
          </div>

          <div className="w-full border-t border-white/20 bg-white/97 px-4 py-5 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm sm:px-6 sm:py-6">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="animate-fade-in-up">
                <HeroSearchFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
