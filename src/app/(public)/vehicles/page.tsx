import CarsCatalog from "@/components/CarsCatalog";
import { createMetadata } from "@/lib/seo/metadata";
import { routes } from "@/config/routes";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("catalog");

  return createMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    path: routes.vehicles,
  });
}

export default function VehiclesPage() {
  return <CarsCatalog />;
}
