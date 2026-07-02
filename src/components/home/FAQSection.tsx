"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { faqItems } from "@/data/faq";

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(faqItems[0]?.id ?? null);

  return (
    <section className="bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">
          FAQ
        </h2>

        <div className="divide-y divide-[#E5E5E5] overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
          {faqItems.map((faq) => {
            const open = openId === faq.id;

            return (
              <div key={faq.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : faq.id)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-[#FAFAFA]"
                >
                  <span className="pr-4 text-sm font-semibold text-[#1A1A1A]">{faq.question}</span>
                  {open ? (
                    <Minus className="h-4 w-4 shrink-0 text-[#E8192C]" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-[#888]" />
                  )}
                </button>
                {open ? (
                  <div className="px-6 pb-5 transition-all duration-300">
                    <p className="text-sm leading-relaxed text-[#666]">{faq.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
