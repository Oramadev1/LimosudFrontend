import { notFound } from "next/navigation";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import BlogPostClient from "@/components/blog/BlogPostClient";
import { routes } from "@/config/routes";
import { getBlogPostBySlug, getLocalizedBlogPosts } from "@/lib/blogs";
import { getAllBlogSlugs } from "@/lib/blogs";
import { createMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const t = await getTranslations("blog");
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return createMetadata({ title: t("notFound"), noIndex: true });
  }

  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const localized = getLocalizedBlogPosts(locale, messages as Record<string, unknown>).find(
    (item) => item.slug === slug,
  );

  return createMetadata({
    title: localized?.title ?? post.title,
    description: localized?.excerpt ?? post.excerpt,
    path: routes.blogPost(post.slug),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const localized = getLocalizedBlogPosts(locale, messages as Record<string, unknown>).find(
    (item) => item.slug === slug,
  );

  return <BlogPostClient post={localized ?? post} />;
}
