"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import SearchForm from "@/components/SearchForm";
import { siteConfig } from "@/config/site";

function HeroCopy() {
  const t = useTranslations("hero");

  return (
    <div className="animate-fade-in-left max-w-2xl">
      <h1 className="text-3xl leading-tight font-extrabold text-white drop-shadow-md sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
        {t("titleLine1")}
        <br />
        <span className="text-[#FF6B6B]">{t("titleAccent")}</span>
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/95 drop-shadow sm:text-base">
        {t("description")}
      </p>

      <div className="mt-6 flex gap-8 sm:mt-8 sm:gap-10">
        <div>
          <span className="text-xl font-bold text-white drop-shadow sm:text-2xl">50+</span>
          <p className="mt-0.5 text-xs text-white/85">{t("statsBrands")}</p>
        </div>
        <div>
          <span className="text-xl font-bold text-white drop-shadow sm:text-2xl">10k+</span>
          <p className="mt-0.5 text-xs text-white/85">{t("statsClients")}</p>
        </div>
      </div>
    </div>
  );
}

function HeroSearchFooter() {
  return (
    <Suspense
      fallback={
        <div
          className="h-40 w-full animate-pulse rounded-2xl bg-white/70"
          aria-hidden="true"
        />
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
          alt="Limosud Cars"
          fill
          priority
          className="object-cover object-center opacity-95"
          sizes="100vw"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[inherit] flex-col justify-between pt-[96px]">
          <div className="px-6 pb-6 pt-2">
            <div className="mx-auto w-full max-w-[1200px]">
              <HeroCopy />
            </div>
          </div>

          <div className="px-4 pb-8 pt-2 sm:px-6 sm:pb-10">
            <div className="animate-fade-in-up mx-auto w-full max-w-[980px]">
              <div className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-5 text-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:px-6 sm:py-6">
                <HeroSearchFooter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
