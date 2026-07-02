"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { testimonials } from "@/data/testimonials";

type TestimonialMessage = {
  role: string;
  quote: string;
};

export function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as TestimonialMessage[];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => {
            const message = items[index];

            return (
              <div
                key={item.id}
                className="rounded-xl border border-[#E5E5E5] bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-[#666] italic">
                  &ldquo;{message?.quote ?? ""}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">{item.name}</p>
                    <p className="text-xs text-[#888]">{message?.role ?? ""}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
