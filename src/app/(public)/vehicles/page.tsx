import { getAllVehicles } from "@/lib/api/public";
import { intlLocale } from "@/lib/i18n/locale-tags";
import { createMetadata } from "@/lib/seo/metadata";
import { routes } from "@/config/routes";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";

import CarsCatalog from "@/components/CarsCatalog";

export async function generateMetadata() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  return createMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    path: routes.vehicles,
    locale: intlLocale(locale),
  });
}

export default async function VehiclesPage() {
  const initialVehicles = await getAllVehicles().catch(() => []);

  return <CarsCatalog initialVehicles={initialVehicles} />;
}
