"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Menu, Moon, Search, SlidersHorizontal, Sun, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/cars?q=${encodeURIComponent(q)}`);
    else router.push("/cars");
    setMobileOpen(false);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const themeButton = (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white px-6 py-4 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-wide text-[#3563E9] transition-opacity hover:opacity-80 sm:text-2xl"
        >
          {siteConfig.brand}
        </Link>

        <form
          role="search"
          onSubmit={handleSearch}
          className="hidden w-full max-w-[492px] items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 transition-colors md:flex dark:border-gray-700 dark:bg-gray-800"
        >
          <button type="submit" aria-label="Search" className="shrink-0">
            <Search
              className="text-gray-400 transition-colors hover:text-[#3563E9]"
              size={20}
              aria-hidden="true"
            />
          </button>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search something here"
            aria-label="Search cars"
            className="flex-1 bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-300 dark:text-gray-300 dark:placeholder:text-gray-500"
          />
          <SlidersHorizontal className="shrink-0 text-gray-400" size={20} aria-hidden="true" />
        </form>

        <div className="hidden shrink-0 md:flex">{themeButton}</div>

        <div className="flex items-center gap-3 md:hidden">
          {themeButton}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="text-gray-500 transition-colors hover:text-[#3563E9]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div id="mobile-menu" className="mt-4 md:hidden">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
          >
            <button type="submit" aria-label="Search" className="shrink-0">
              <Search
                className="text-gray-400 transition-colors hover:text-[#3563E9]"
                size={18}
                aria-hidden="true"
              />
            </button>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search something here"
              aria-label="Search cars"
              className="flex-1 bg-transparent text-sm text-gray-500 outline-none dark:text-gray-300"
            />
          </form>
        </div>
      ) : null}
    </nav>
  );
}
