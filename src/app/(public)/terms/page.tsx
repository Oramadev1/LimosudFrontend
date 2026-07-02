import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const t = await getTranslations("terms");

  return createMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    path: routes.terms,
  });
}

export default async function TermsPage() {
  const t = await getTranslations("terms");
  const termsItems = t.raw("termsItems") as string[];

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-medium text-[#E8192C]">{siteConfig.brand}</p>
        <h1 className="mt-2 text-3xl font-bold text-[#1A1A1A]">{t("title")}</h1>
      </div>

      <section className="mb-10 rounded-[10px] border border-[#E5E5E5] bg-white p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">{t("cancellationTitle")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#555]">{t("cancellationText")}</p>
      </section>

      <section className="mb-10 rounded-[10px] border border-[#E5E5E5] bg-white p-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">{t("termsTitle")}</h2>
        <ol className="mt-5 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-[#555]">
          {termsItems.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ol>
      </section>

      <p className="mt-8 text-center text-sm text-[#888]">
        <Link href={routes.vehicles} className="font-medium text-[#3563E9] hover:underline">
          {t("browseVehicles")}
        </Link>
        {" · "}
        <Link href={routes.home} className="font-medium text-[#3563E9] hover:underline">
          {t("backHome")}
        </Link>
      </p>
    </div>
  );
}
