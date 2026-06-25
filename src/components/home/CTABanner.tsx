import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function CTABanner() {
  return (
    <section className="relative flex min-h-[280px] items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200"
        alt="Voiture de nuit"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6">
        <div className="ml-auto max-w-xs">
          <h2 className="text-3xl font-bold text-white">ACTUALITÉS AUTO</h2>
          <p className="mt-3 mb-6 text-sm leading-relaxed text-white/75">
            Louez facilement avec {siteConfig.shortName}. Réservez en ligne et profitez
            d&apos;une flotte premium à Dakhla.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={siteConfig.adminUrl}
              className="rounded border border-white px-6 py-2.5 text-sm text-white transition hover:bg-white/10"
            >
              Espace admin
            </Link>
            <Link
              href="/vehicles"
              className="rounded bg-[#E8192C] px-6 py-2.5 text-sm text-white transition hover:bg-red-700"
            >
              Voir les véhicules
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
