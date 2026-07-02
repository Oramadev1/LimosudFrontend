import BlogListClient from "@/components/blog/BlogListClient";
import { routes } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import { intlLocale } from "@/lib/i18n/locale-tags";
import { createMetadata } from "@/lib/seo/metadata";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("blog");

  return createMetadata({
    title: t("pageTitle"),
    description: t("pageSubtitle"),
    path: routes.blog,
    locale: intlLocale(locale),
  });
}

export default function BlogPage() {
  return <BlogListClient />;
}
