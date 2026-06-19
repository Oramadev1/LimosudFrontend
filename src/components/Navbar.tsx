"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useTheme } from "@/components/ThemeProvider";
import { routes } from "@/config/routes";
import { useSubmitLock } from "@/lib/use-submit-lock";
import { Moon, Search, Sun } from "lucide-react";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { runOnce, busy } = useSubmitLock();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    void runOnce(async () => {
      const q = query.trim();
      if (q) router.push(`${routes.vehicles}?q=${encodeURIComponent(q)}`);
      else router.push(routes.vehicles);
    });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo href={routes.home} height={42} className="min-w-0" />

          <form
            role="search"
            onSubmit={handleSearch}
            className="ml-auto hidden min-w-0 max-w-[240px] flex-1 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 md:flex dark:border-gray-700 dark:bg-gray-800"
          >
            <Search size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search vehicles"
              aria-label="Search vehicles"
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
            />
          </form>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 md:ml-0 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <form
          role="search"
          onSubmit={handleSearch}
          className="mt-3 flex min-w-0 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 md:hidden dark:border-gray-700 dark:bg-gray-800"
        >
          <Search size={16} className="shrink-0 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search vehicles"
            aria-label="Search vehicles"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
          />
        </form>
      </div>
    </nav>
  );
}
