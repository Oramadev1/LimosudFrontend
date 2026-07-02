import CheckoutPageClient from "@/components/CheckoutPageClient";
import { createMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("checkout");

  return createMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    path: "/book",
    noIndex: true,
  });
}

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  return <CheckoutPageClient slug={slug} />;
}
