import { getTranslations } from "next-intl/server";

import BookingSuccessClient from "@/components/BookingSuccessClient";
import { routes } from "@/config/routes";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const t = await getTranslations("checkout");

  return createMetadata({
    title: t("successMetadataTitle"),
    description: t("successMetadataDescription"),
    path: routes.bookSuccess,
    noIndex: true,
  });
}

export default function BookingSuccessPage() {
  return <BookingSuccessClient />;
}
