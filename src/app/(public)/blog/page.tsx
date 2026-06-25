import BlogListClient from "@/components/blog/BlogListClient";
import { routes } from "@/config/routes";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Blog",
  description: "Conseils et actualités pour votre location de voiture à Dakhla avec Limosud Cars.",
  path: routes.blog,
});

export default function BlogPage() {
  return <BlogListClient />;
}
