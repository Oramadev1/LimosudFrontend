"use client";

import { useTranslations } from "next-intl";

export function VehicleImagePlaceholder({ label }: { label?: string }) {
  const t = useTranslations("vehicle");

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-300">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-4xl" aria-hidden>
          🚗
        </span>
        <span className="text-xs font-medium">{label ?? t("noPhoto")}</span>
      </div>
    </div>
  );
}
