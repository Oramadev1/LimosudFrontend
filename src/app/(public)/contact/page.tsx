import { getLocale, getTranslations } from "next-intl/server";

import { ContactSection } from "@/components/home/ContactSection";
import { routes } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import { intlLocale } from "@/lib/i18n/locale-tags";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("contact");

  return createMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    path: routes.contact,
    locale: intlLocale(locale),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="bg-white">
      <div className="border-b border-[#ECECEC] bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1200px] px-6 py-12 text-center sm:py-14">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#E8192C] uppercase">
            {t("brand")}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">{t("title")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#666] sm:text-base">
            {t("intro")}
          </p>
        </div>
      </div>
      <ContactSection showHeading={false} />
    </div>
  );
}
