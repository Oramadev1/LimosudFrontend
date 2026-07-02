import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import CarDetailPageClient from "@/components/CarDetailPageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { routes } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import { getAllVehicles, getVehicle } from "@/lib/api/public";
import { getVehicleImageUrl } from "@/lib/images";
import { intlLocale } from "@/lib/i18n/locale-tags";
import { createMetadata } from "@/lib/seo/metadata";
import {
  getBreadcrumbSchema,
  getVehicleProductSchema,
} from "@/lib/seo/structured-data";

type VehicleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VehicleDetailPageProps) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  try {
    const { slug } = await params;
    const { data: vehicle } = await getVehicle(slug);
    const image = getVehicleImageUrl(vehicle);

    return createMetadata({
      title: vehicle.name,
      description:
        vehicle.description?.trim() ||
        `Rent ${vehicle.name} in Dakhla with Limosud Cars.`,
      path: routes.vehicle(vehicle.slug),
      locale: intlLocale(locale),
      images: image ?? undefined,
    });
  } catch {
    return createMetadata({ title: t("vehicleNotFound"), noIndex: true });
  }
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  const t = await getTranslations("catalog");

  let vehicle;
  let allVehicles;

  try {
    [vehicle, allVehicles] = await Promise.all([
      getVehicle(slug).then((response) => response.data),
      getAllVehicles(),
    ]);
  } catch {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          getVehicleProductSchema(vehicle),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: t("metadataTitle"), path: routes.vehicles },
            { name: vehicle.name, path: routes.vehicle(vehicle.slug) },
          ]),
        ]}
      />
      <CarDetailPageClient
        slug={slug}
        initialVehicle={vehicle}
        initialVehicles={allVehicles}
      />
    </>
  );
}
