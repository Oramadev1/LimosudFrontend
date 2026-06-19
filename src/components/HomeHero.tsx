"use client";

import { Suspense } from "react";
import { MapPin, ShieldCheck } from "lucide-react";

import SearchForm from "@/components/SearchForm";
import { siteConfig } from "@/config/site";

function HeroBookingForm() {
  return (
    <Suspense
      fallback={
        <div className="h-52 animate-pulse rounded-2xl bg-slate-100" aria-hidden="true" />
      }
    >
      <SearchForm variant="embedded" />
    </Suspense>
  );
}

export default function HomeHero() {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_24px_64px_-32px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-950">
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="order-2 min-w-0 bg-slate-950 px-4 py-7 text-white sm:px-6 sm:py-8 lg:order-1 lg:py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-400/90">
            {siteConfig.shortName} · Dakhla
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-[2.15rem]">
            Premium cars, simple booking
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-300 sm:text-[15px]">
            {siteConfig.description}
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="shrink-0 text-amber-400" aria-hidden="true" />
              Agency &amp; airport pick-up
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="shrink-0 text-amber-400" aria-hidden="true" />
              Clear pricing before you reserve
            </li>
          </ul>
        </div>

        <div className="order-1 min-w-0 border-b border-slate-100 bg-slate-50/80 px-4 py-5 sm:px-5 sm:py-6 lg:order-2 lg:border-b-0 lg:border-l lg:py-7 dark:border-slate-800 dark:bg-slate-900/40">
          <HeroBookingForm />
        </div>
      </div>
    </section>
  );
}
