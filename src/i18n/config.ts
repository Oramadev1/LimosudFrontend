export const locales = ["en", "fr", "ar", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  es: "Español",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
