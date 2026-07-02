"use client";

import { useMemo, useState } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";

import { BlogCard } from "@/components/blog/BlogCard";
import { BLOG_PAGE_SIZE } from "@/data/blogs";
import { getLocalizedBlogPosts } from "@/lib/blogs";
import type { Locale } from "@/i18n/config";

export default function BlogListClient() {
  const t = useTranslations("blog");
  const locale = useLocale() as Locale;
  const messages = useMessages();
  const [page, setPage] = useState(1);

  const { posts, lastPage } = useMemo(() => {
    const localized = getLocalizedBlogPosts(locale, messages as Record<string, unknown>);
    const total = localized.length;
    const pages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
    const currentPage = Math.min(Math.max(page, 1), pages);
    const start = (currentPage - 1) * BLOG_PAGE_SIZE;

    return {
      posts: localized.slice(start, start + BLOG_PAGE_SIZE),
      lastPage: pages,
    };
  }, [locale, messages, page]);

  return (
    <div className="min-w-0 bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-wide text-[#1A1A1A] uppercase">{t("pageTitle")}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#666]">{t("pageSubtitle")}</p>
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
              {t("previous")}
            </button>
            <span className="text-sm text-[#666]">
              {t("pageOf", { page, lastPage })}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(lastPage, current + 1))}
              disabled={page >= lastPage}
              className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-sm text-[#333] transition hover:border-[#CCC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("next")}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
