import CarsCatalog from "@/components/CarsCatalog";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Browse Cars",
  description: "Browse the Limosud Cars rental fleet.",
  path: "/cars",
});

export default function CarsPage() {
  return <CarsCatalog />;
}
