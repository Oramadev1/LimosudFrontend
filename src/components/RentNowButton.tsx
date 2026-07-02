"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { routes } from "@/config/routes";
import { buildBookUrl, rentalSearchFromQuery } from "@/lib/rental-search";

function RentNowButtonInner({
  slug,
  large = false,
  disabled = false,
}: {
  slug: string;
  large?: boolean;
  disabled?: boolean;
}) {
  const t = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const rental = rentalSearchFromQuery(searchParams);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => router.push(buildBookUrl(slug, rental))}
      className={`rounded-[4px] font-semibold text-white transition-colors ${
        large ? "px-8 py-3 text-base" : "px-4 py-2 text-sm"
      } ${
        disabled
          ? "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          : "bg-[#3563E9] hover:bg-[#2a52c9]"
      }`}
    >
      {disabled ? t("unavailable") : t("rentNow")}
    </button>
  );
}

export default function RentNowButton(props: {
  slug: string;
  large?: boolean;
  disabled?: boolean;
}) {
  const t = useTranslations("common");

  return (
    <Suspense
      fallback={
        <button
          type="button"
          disabled={props.disabled}
          className={`rounded-[4px] font-semibold text-white transition-colors ${
            props.large ? "px-8 py-3 text-base" : "px-4 py-2 text-sm"
          } ${
            props.disabled
              ? "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              : "bg-[#3563E9] hover:bg-[#2a52c9]"
          }`}
        >
          {props.disabled ? t("unavailable") : t("rentNow")}
        </button>
      }
    >
      <RentNowButtonInner {...props} />
    </Suspense>
  );
}
