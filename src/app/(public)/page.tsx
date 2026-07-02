import HomePageClient from "@/components/HomePageClient";
import { BlogSection } from "@/components/blog/BlogSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllVehicles } from "@/lib/api/public";
import { intlLocale } from "@/lib/i18n/locale-tags";
import { createMetadata } from "@/lib/seo/metadata";
import { getFaqSchema } from "@/lib/seo/structured-data";
import type { Locale } from "@/i18n/config";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home");

  return createMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    path: "/",
    keywords: t.raw("metadataKeywords") as string[],
    locale: intlLocale(locale),
  });
}

export default async function HomePage() {
  const t = await getTranslations("faq");
  const faqItems = t.raw("items") as Array<{ question: string; answer: string }>;
  const initialVehicles = await getAllVehicles().catch(() => []);

  return (
    <>
      <JsonLd data={getFaqSchema(faqItems)} />
      <HomePageClient
        blogSection={<BlogSection />}
        initialVehicles={initialVehicles}
      />
    </>
  );
}
