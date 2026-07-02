import CarDetailPageClient from "@/components/CarDetailPageClient";
import { routes } from "@/config/routes";
import { getVehicle } from "@/lib/api/public";
import { createMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";

type VehicleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VehicleDetailPageProps) {
  const t = await getTranslations("catalog");

  try {
    const { slug } = await params;
    const { data: vehicle } = await getVehicle(slug);

    return createMetadata({
      title: vehicle.name,
      description: vehicle.description ?? `Rent ${vehicle.name} at Limosud Cars.`,
      path: routes.vehicle(vehicle.slug),
    });
  } catch {
    return createMetadata({ title: t("vehicleNotFound"), noIndex: true });
  }
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug } = await params;
  return <CarDetailPageClient slug={slug} />;
}
