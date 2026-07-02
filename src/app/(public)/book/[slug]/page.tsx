import CheckoutPageClient from "@/components/CheckoutPageClient";
import { routes } from "@/config/routes";
import { createMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BookPageProps) {
  const t = await getTranslations("checkout");
  const { slug } = await params;

  return createMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    path: routes.book(slug),
    noIndex: true,
  });
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  return <CheckoutPageClient slug={slug} />;
}
