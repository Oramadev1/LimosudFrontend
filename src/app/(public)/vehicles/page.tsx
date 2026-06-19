import CarsCatalog from "@/components/CarsCatalog";
import { createMetadata } from "@/lib/seo/metadata";
import { routes } from "@/config/routes";

export const metadata = createMetadata({
  title: "Our fleet",
  description: "Browse the Limosud Cars rental fleet in Dakhla.",
  path: routes.vehicles,
});

export default function VehiclesPage() {
  return <CarsCatalog />;
}
