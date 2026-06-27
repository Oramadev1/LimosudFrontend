"use client";

import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/components/ThemeProvider";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <h2 className="border-b border-gray-100 px-6 py-4 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
        {title}
      </h2>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">{children}</div>
    </div>
  );
}

function Row({ label, desc, right }: { label: string; desc?: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {desc ? <p className="mt-0.5 text-xs text-gray-400">{desc}</p> : null}
      </div>
      {right}
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>

      <Section title={t("appearance")}>
        <Row
          label={t("darkMode")}
          desc={t("darkModeDesc")}
          right={
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
              aria-label={t("darkMode")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          }
        />
        <Row
          label={t("language")}
          desc={t("languageDesc")}
          right={<LanguageSwitcher />}
        />
      </Section>
    </main>
  );
}
