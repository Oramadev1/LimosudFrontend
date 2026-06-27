"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

import { localeNames, locales, type Locale } from "@/i18n/config";

type LanguageSwitcherProps = {
  className?: string;
  onDark?: boolean;
};

export function LanguageSwitcher({ className = "", onDark = false }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("nav");

  function changeLanguage(nextLocale: Locale) {
    document.cookie = `locale=${nextLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    router.refresh();
  }

  return (
    <label className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <Globe
        size={16}
        className={onDark ? "text-white drop-shadow" : "text-[#666666]"}
        aria-hidden="true"
      />
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        onChange={(event) => changeLanguage(event.target.value as Locale)}
        className={`rounded-lg border px-2.5 py-1.5 text-sm outline-none transition ${
          onDark
            ? "border-white/40 bg-black/20 text-white backdrop-blur-sm"
            : "border-[#E5E5E5] bg-white text-[#333333]"
        }`}
        aria-label={t("language")}
      >
        {locales.map((code) => (
          <option key={code} value={code} className="text-[#333333]">
            {localeNames[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
