"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

type FaqItem = {
  question: string;
  answer: string;
};

export function FAQSection() {
  const t = useTranslations("faq");
  const faqItems = t.raw("items") as FaqItem[];
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <section className="bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">
          {t("title")}
        </h2>

        <div className="divide-y divide-[#E5E5E5] overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
          {faqItems.map((faq, index) => {
            const open = openId === index;

            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : index)}
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
