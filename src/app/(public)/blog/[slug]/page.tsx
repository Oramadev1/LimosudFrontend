import { notFound } from "next/navigation";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import BlogPostClient from "@/components/blog/BlogPostClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { routes } from "@/config/routes";
import type { Locale } from "@/i18n/config";
import { getBlogPostBySlug, getLocalizedBlogPosts } from "@/lib/blogs";
import { getAllBlogSlugs } from "@/lib/blogs";
import { intlLocale } from "@/lib/i18n/locale-tags";
import { createMetadata } from "@/lib/seo/metadata";
import {
  getBlogPostingSchema,
  getBreadcrumbSchema,
} from "@/lib/seo/structured-data";

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return createMetadata({ title: t("notFound"), noIndex: true });
  }

  const messages = await getMessages();
  const localized = getLocalizedBlogPosts(locale, messages as Record<string, unknown>).find(
    (item) => item.slug === slug,
  );
  const title = localized?.title ?? post.title;
  const description = localized?.excerpt ?? post.excerpt;

  return createMetadata({
    title,
    description,
    path: routes.blogPost(post.slug),
    locale: intlLocale(locale),
    openGraphType: "article",
    publishedTime: post.publishedAt,
    authors: ["Limosud Cars"],
    images: post.coverImage,
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
  const t = await getTranslations("blog");
  const localized = getLocalizedBlogPosts(locale, messages as Record<string, unknown>).find(
    (item) => item.slug === slug,
  );
  const resolvedPost = localized ?? post;

  return (
    <>
      <JsonLd
        data={[
          getBlogPostingSchema(resolvedPost),
          getBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: t("pageTitle"), path: routes.blog },
            { name: resolvedPost.title, path: routes.blogPost(resolvedPost.slug) },
          ]),
        ]}
      />
      <BlogPostClient post={resolvedPost} />
    </>
  );
}
