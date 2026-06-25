"use client";

import { useState } from "react";

import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPostsPage } from "@/lib/blogs";

export default function BlogListClient() {
  const [page, setPage] = useState(1);
  const { data: posts, meta } = getBlogPostsPage(page);
  const lastPage = meta.last_page;

  return (
    <div className="min-w-0 bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-wide text-[#1A1A1A] uppercase">Blog</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#666]">
            Guides pratiques, conseils de route et inspirations pour votre séjour à Dakhla avec
            Limosud Cars.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {lastPage > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-sm text-[#333] transition hover:border-[#CCC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-sm text-[#666]">
              Page {page} / {lastPage}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(lastPage, current + 1))}
              disabled={page >= lastPage}
              className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-sm text-[#333] transition hover:border-[#CCC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
