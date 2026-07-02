import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";

export default async function CarNotFound() {
  const t = await getTranslations("catalog");

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="text-5xl">🚗</span>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("carNotFound")}
      </h1>
      <p className="text-sm text-gray-500">{t("vehicleNotFoundDesc")}</p>
      <Link
        href={routes.vehicles}
        className="text-sm font-semibold text-[#3563E9] hover:underline"
      >
        {t("browseCars")}
      </Link>
    </main>
  );
}
