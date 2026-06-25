import HomePageClient from "@/components/HomePageClient";
import { listPublicCarImages } from "@/lib/public-car-images";

export default function HomePage() {
  return <HomePageClient carImages={listPublicCarImages()} />;
}
