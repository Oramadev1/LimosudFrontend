"use client";

import { Car, Headphones, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const featureIcons = [ShieldCheck, Car, Headphones] as const;
const featureKeys = ["reliability", "choice", "support"] as const;

export function WhyChooseUsSection() {
  const t = useTranslations("home");

  return (
    <section className="bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">
          {t("whyChooseUs")}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {featureKeys.map((key, index) => {
            const Icon = featureIcons[index];

            return (
              <div key={key} className="flex flex-col items-center p-6 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8192C]/10">
                  <Icon className="h-7 w-7 text-[#E8192C]" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">
                  {t(`features.${key}Title`)}
                </h3>
                <p className="text-sm leading-relaxed text-[#666]">
                  {t(`features.${key}Text`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
