import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <p className="text-8xl font-extrabold text-[#3563E9] mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t("heading")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {t("body")}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="bg-[#3563E9] hover:bg-[#2a52c9] transition-colors text-white font-semibold px-6 py-3 rounded-[4px] inline-block"
            >
              {t("goHome")}
            </Link>
            <Link
              href={routes.vehicles}
              className="border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-[4px] inline-block"
            >
              {t("browseFleet")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
