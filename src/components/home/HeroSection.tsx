"use client";

import Image from "next/image";

import { heroStats, siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section className="relative -mt-[72px] w-full overflow-hidden bg-[#F5F5F5] pt-[72px]">
      <div className="relative aspect-[21/9] min-h-[320px] w-full sm:min-h-[400px] lg:min-h-[480px] xl:min-h-[560px]">
        <Image
          src={siteConfig.heroBanner}
          alt="Limosud Cars rental fleet — airport, business, and scenic travel"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/10 sm:from-white/92 sm:via-white/65 sm:to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-10 sm:py-12">
            <div className="animate-fade-in-left max-w-xl">
              <h1 className="text-3xl leading-tight font-extrabold text-[#111111] sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
                Buy, sell &amp; rent
                <br />
                <span className="text-[#CC0000]">reputable cars</span>
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
          </div>
        </div>
      </div>
    </section>
  );
}
