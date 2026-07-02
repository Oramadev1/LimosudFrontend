import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { routes } from "@/config/routes";
import { formatBlogDate } from "@/lib/format";
import type { BlogPost } from "@/types/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:bg-white">
      <div className="relative h-[180px] w-full overflow-hidden bg-[#FAFAFA]">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 flex items-center gap-1.5 text-xs text-[#888]">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatBlogDate(post.publishedAt)}
        </p>

        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-[#1A1A1A]">{post.title}</h3>
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-[#666]">{post.excerpt}</p>

        <Link
          href={routes.blogPost(post.slug)}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#E8192C] transition hover:gap-2"
        >
          Lire l&apos;article <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
