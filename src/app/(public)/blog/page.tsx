import BlogListClient from "@/components/blog/BlogListClient";
import { routes } from "@/config/routes";
import { createMetadata } from "@/lib/seo/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("blog");

  return createMetadata({
    title: t("pageTitle"),
    description: t("pageSubtitle"),
    path: routes.blog,
  });
}

export default function BlogPage() {
  return <BlogListClient />;
}
