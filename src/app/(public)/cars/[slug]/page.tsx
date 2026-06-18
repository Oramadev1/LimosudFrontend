import CarDetailPageClient from "@/components/CarDetailPageClient";
import { getVehicle } from "@/lib/api/public";
import { createMetadata } from "@/lib/seo/metadata";

type CarDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CarDetailPageProps) {
  try {
    const { slug } = await params;
    const { data: vehicle } = await getVehicle(slug);

    return createMetadata({
      title: vehicle.name,
      description: vehicle.description ?? `Rent ${vehicle.name} at Limosud Cars.`,
      path: `/cars/${vehicle.slug}`,
    });
  } catch {
    return createMetadata({ title: "Car not found", noIndex: true });
  }
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { slug } = await params;
  return <CarDetailPageClient slug={slug} />;
}
