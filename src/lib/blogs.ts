import { BLOG_PAGE_SIZE, blogPosts } from "@/data/blogs";
import type { BlogPost } from "@/types/blog";

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
  return getAllBlogPosts().slice(0, limit);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug);
}

export function getBlogPostsPage(page = 1, perPage = BLOG_PAGE_SIZE) {
  const posts = getAllBlogPosts();
  const lastPage = Math.max(1, Math.ceil(posts.length / perPage));
  const currentPage = Math.min(Math.max(page, 1), lastPage);
  const start = (currentPage - 1) * perPage;

  return {
    data: posts.slice(start, start + perPage),
    meta: {
      current_page: currentPage,
      last_page: lastPage,
      per_page: perPage,
      total: posts.length,
    },
  };
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((post) => post.slug);
}
