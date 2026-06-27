"use client";

import Image from "next/image";

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

export function HeroSection() {
  return (
    <section className="relative -mt-[72px] w-full overflow-hidden">
      <div className="relative w-full lg:min-h-[560px] xl:min-h-[620px]">
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10 lg:bg-gradient-to-r lg:from-black/50 lg:via-black/20 lg:to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-28 sm:pb-10 lg:inset-0 lg:flex lg:items-center lg:pb-12 lg:pt-[88px]">
          <div className="pointer-events-auto mx-auto w-full max-w-[1200px]">
            <HeroCopy />
          </div>
        </div>
      </div>
    </section>
  );
}
