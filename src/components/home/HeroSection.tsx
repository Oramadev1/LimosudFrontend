"use client";

import Image from "next/image";

import { heroStats, siteConfig } from "@/config/site";

function HeroCopy({ onImage = false }: { onImage?: boolean }) {
  const titleClass = onImage
    ? "text-white drop-shadow-sm"
    : "text-[#111111]";
  const accentClass = onImage ? "text-[#FFCCCC]" : "text-[#CC0000]";
  const bodyClass = onImage ? "text-white/90 drop-shadow-sm" : "text-[#666666]";
  const statValueClass = onImage ? "text-white drop-shadow-sm" : "text-[#111111]";
  const statLabelClass = onImage ? "text-white/80" : "text-[#666666]";

  return (
    <div className="animate-fade-in-left max-w-xl">
      <h1
        className={`text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl xl:text-[3.25rem] ${titleClass}`}
      >
        Louez des voitures
        <br />
        <span className={accentClass}>de confiance</span>
      </h1>
      <p className={`mt-4 max-w-md text-sm leading-relaxed sm:text-base ${bodyClass}`}>
        {siteConfig.description}
      </p>

      <div className="mt-8 flex gap-10">
        {heroStats.map((stat) => (
          <div key={stat.label}>
            <span className={`text-2xl font-bold ${statValueClass}`}>{stat.value}</span>
            <p className={`mt-0.5 text-xs ${statLabelClass}`}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative -mt-[72px] w-full overflow-hidden bg-[#E8F4FC]">
      {/* Mobile: image starts under transparent navbar */}
      <div className="lg:hidden">
        <div className="relative w-full">
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

      {/* Desktop: banner with text overlay on image */}
      <div className="relative hidden min-h-[520px] w-full lg:block xl:min-h-[600px]">
        <Image
          src={siteConfig.heroBanner}
          alt="Limosud Cars — location de voitures à Dakhla"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-center pt-[72px]">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-12">
            <HeroCopy onImage />
          </div>
        </div>
      </div>
    </section>
  );
}
