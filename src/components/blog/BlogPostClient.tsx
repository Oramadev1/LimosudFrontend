import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { routes } from "@/config/routes";
import { formatBlogDate } from "@/lib/format";
import type { BlogPost } from "@/types/blog";

export default function BlogPostClient({ post }: { post: BlogPost }) {
  return (
    <article className="min-w-0 bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[800px] px-6">
        <Link
          href={routes.blog}
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#666] transition hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les articles
        </Link>

        <p className="mb-3 flex items-center gap-1.5 text-sm text-[#888]">
          <CalendarDays className="h-4 w-4" />
          {formatBlogDate(post.publishedAt)}
        </p>

        <h1 className="mb-8 text-3xl font-bold leading-tight text-[#1A1A1A]">{post.title}</h1>

        <div className="relative mb-10 h-[280px] overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="800px"
            priority
          />
        </div>

        <div className="space-y-4 rounded-xl border border-[#E5E5E5] bg-white p-6 text-[#333]">
          {post.content
            .split("\n\n")
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
        </div>
      </div>
    </article>
  );
}
