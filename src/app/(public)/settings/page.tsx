"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Check } from "lucide-react";

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

const STORAGE_KEY = "limosud-settings";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("English");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language) setLanguage(parsed.language);
      }
    } catch {
      // ignore invalid local storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ language }));
      setSaved(true);
      const timer = window.setTimeout(() => setSaved(false), 1500);
      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, [language]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        {saved ? (
          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
            <Check size={16} /> Saved
          </span>
        ) : null}
      </div>

      <Section title="Appearance">
        <Row
          label="Dark Mode"
          desc="Switch between light and dark theme"
          right={
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          }
        />
        <Row
          label="Language"
          desc="Select your preferred language"
          right={
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[#3563E9] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <option>English</option>
              <option>Urdu</option>
              <option>Arabic</option>
              <option>French</option>
            </select>
          }
        />
      </Section>
    </main>
  );
}
