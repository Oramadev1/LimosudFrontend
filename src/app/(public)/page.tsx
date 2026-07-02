import HomePageClient from "@/components/HomePageClient";
import { BlogSection } from "@/components/blog/BlogSection";

export default function HomePage() {
  return <HomePageClient blogSection={<BlogSection />} />;
}
