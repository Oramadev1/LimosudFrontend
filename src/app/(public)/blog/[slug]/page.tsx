import { notFound } from "next/navigation";

import BlogPostClient from "@/components/blog/BlogPostClient";
import { routes } from "@/config/routes";
import { getBlogPostBySlug } from "@/lib/blogs";
import { getAllBlogSlugs } from "@/lib/blogs";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return createMetadata({ title: "Article introuvable", noIndex: true });
  }

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: routes.blogPost(post.slug),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
