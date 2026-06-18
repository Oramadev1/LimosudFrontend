"use client";

import { useRouter } from "next/navigation";

export default function RentNowButton({
  slug,
  large = false,
}: {
  slug: string;
  large?: boolean;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/checkout?slug=${encodeURIComponent(slug)}`)}
      className={`rounded-[4px] bg-[#3563E9] font-semibold text-white transition-colors hover:bg-[#2a52c9] ${
        large ? "px-8 py-3 text-base" : "px-4 py-2 text-sm"
      }`}
    >
      Rent Now
    </button>
  );
}
