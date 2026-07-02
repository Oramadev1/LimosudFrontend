import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { BlogCard } from "@/components/blog/BlogCard";
import { routes } from "@/config/routes";
import { getLocalizedBlogPosts } from "@/lib/blogs";
import type { Locale } from "@/i18n/config";

export async function BlogSection() {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const posts = getLocalizedBlogPosts(locale, messages as Record<string, unknown>).slice(0, 3);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">{t("title")}</h2>
            <p className="mt-2 max-w-xl text-sm text-[#666]">{t("subtitle")}</p>
          </div>
          <Link
            href={routes.blog}
            className="hidden shrink-0 items-center gap-1 text-sm text-[#666] transition hover:text-[#1A1A1A] sm:flex"
          >
            {t("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={routes.blog}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#E8192C]"
          >
            {t("viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
