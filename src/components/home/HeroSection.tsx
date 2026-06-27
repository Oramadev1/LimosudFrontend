"use client";

import Image from "next/image";

import { heroStats, siteConfig } from "@/config/site";

function HeroCopy() {
  return (
    <div className="animate-fade-in-left max-w-xl">
      <h1 className="text-3xl leading-tight font-extrabold text-[#111111] sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
        Louez des voitures
        <br />
        <span className="text-[#CC0000]">de confiance</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#666666] sm:text-base">
        {siteConfig.description}
      </p>

      <div className="mt-8 flex gap-10">
        {heroStats.map((stat) => (
          <div key={stat.label}>
            <span className="text-2xl font-bold text-[#111111]">{stat.value}</span>
            <p className="mt-0.5 text-xs text-[#666666]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative -mt-[72px] w-full overflow-hidden bg-[#E8F4FC] pt-[72px] lg:bg-[#F5F5F5]">
      {/* Mobile: full panoramic image, then text below */}
      <div className="lg:hidden">
        <div className="relative w-full bg-[#E8F4FC]">
          <Image
            src={siteConfig.heroBanner}
            alt="Limosud Cars — location de voitures à Dakhla"
            width={1920}
            height={720}
            priority
            className="h-auto w-full object-contain"
            sizes="100vw"
          />
        </div>
        <div className="bg-white px-6 py-8">
          <HeroCopy />
        </div>
      </div>

      {/* Desktop: widescreen banner with text overlay */}
      <div className="relative hidden aspect-[21/9] min-h-[480px] w-full lg:block xl:min-h-[560px]">
        <Image
          src={siteConfig.heroBanner}
          alt="Limosud Cars — location de voitures à Dakhla"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-12">
            <HeroCopy />
          </div>
        </div>
      </div>
    </section>
  );
}
