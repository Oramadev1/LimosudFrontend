import { getAllVehicles } from "@/lib/api/public";
import { intlLocale } from "@/lib/i18n/locale-tags";
import { createMetadata } from "@/lib/seo/metadata";
import { routes } from "@/config/routes";
import { toApiDatetime } from "@/lib/format";
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
    keywords: t.raw("metadataKeywords") as string[],
    locale: intlLocale(locale),
  });
}

type VehiclesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const params = await searchParams;
  const from = typeof params.from === "string" ? params.from : undefined;
  const to = typeof params.to === "string" ? params.to : undefined;

  const period =
    from && to
      ? {
          startDatetime: toApiDatetime(from),
          endDatetime: toApiDatetime(to),
        }
      : undefined;

  const initialVehicles = await getAllVehicles(period).catch(() => []);

  return <CarsCatalog initialVehicles={initialVehicles} initialPeriod={period ?? null} />;
}
