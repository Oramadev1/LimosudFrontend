import HomePageClient from "@/components/HomePageClient";
import { listHeroVehicleImages } from "@/lib/public-car-images";

export default function HomePage() {
  return <HomePageClient heroImages={listHeroVehicleImages()} />;
}
