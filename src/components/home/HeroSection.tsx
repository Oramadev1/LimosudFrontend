"use client";

import { siteConfig } from "@/config/site";

import { HeroCarShowcase } from "./HeroCarShowcase";

export function HeroSection({ carImages }: { carImages: string[] }) {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2">
        <div className="animate-fade-in-left">
          <h1 className="text-4xl leading-tight font-extrabold text-[#1A1A1A] sm:text-5xl">
            Louez des voitures
            <br />
            <span className="text-[#E8192C]">de confiance</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#666]">
            {siteConfig.description}
          </p>

          <div className="mt-8 flex gap-10">
            <div>
              <span className="text-2xl font-bold text-[#1A1A1A]">50+</span>
              <p className="mt-0.5 text-xs text-[#888]">Marques</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-[#1A1A1A]">10k+</span>
              <p className="mt-0.5 text-xs text-[#888]">Clients</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-right lg:-mr-4">
          <HeroCarShowcase images={carImages} />
        </div>
      </div>
    </section>
  );
}
