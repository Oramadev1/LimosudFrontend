import type { Locale } from "@/i18n/config";
import { blogPosts } from "@/data/blogs";
import type { BlogPost } from "@/types/blog";

type BlogMessagePost = {
  title?: string;
  excerpt?: string;
  content?: string;
};

export function localizeBlogPost(
  post: BlogPost,
  messages: Record<string, unknown>,
): BlogPost {
  const posts = messages.blogPosts as Record<string, BlogMessagePost> | undefined;
  const localized = posts?.[post.slug];

  if (!localized) {
    return post;
  }

  return {
    ...post,
    title: localized.title ?? post.title,
    excerpt: localized.excerpt ?? post.excerpt,
    content: localized.content ?? post.content,
  };
}

export function localizeBlogPosts(locale: Locale, messages: Record<string, unknown>): BlogPost[] {
  return blogPosts.map((post) => localizeBlogPost(post, messages));
}
