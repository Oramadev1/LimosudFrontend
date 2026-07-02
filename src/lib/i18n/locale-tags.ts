import type { Locale } from "@/i18n/config";

const localeTags: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
};

export function intlLocale(locale: Locale): string {
  return localeTags[locale];
}
