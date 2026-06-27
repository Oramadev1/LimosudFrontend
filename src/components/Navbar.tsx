"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";
import { routes } from "@/config/routes";
import { navLinks, siteConfig } from "@/config/site";

const navHref: Record<string, string> = {
  "Home Page": routes.home,
  "Rent Car": routes.vehicles,
  "Buy Car": routes.vehicles,
  News: routes.blog,
};

function isNavActive(pathname: string, label: string): boolean {
  if (label === "Home Page") {
    return pathname === routes.home;
  }

  if (label === "Rent Car" || label === "Buy Car") {
    return pathname.startsWith(routes.vehicles) || pathname.startsWith("/book");
  }

  if (label === "News") {
    return pathname.startsWith(routes.blog);
  }

  return false;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === routes.home;

  return (
    <header
      className={`sticky top-0 z-50 ${
        isHome
          ? "border-b border-white/30 bg-white/90 backdrop-blur-md"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-6">
        <BrandLogo href={routes.home} height={44} />

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const href = navHref[link.label] ?? routes.home;
            const active = isNavActive(pathname, link.label);

            return (
              <li key={link.label}>
                <Link
                  href={href}
                  className={`text-sm transition hover:text-[#CC0000] ${
                    active
                      ? "border-b-2 border-[#1A1A1A] pb-1 font-semibold text-[#1A1A1A]"
                      : "text-[#666666]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <a
            href={siteConfig.adminUrl}
            className="rounded-lg bg-[#CC0000] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a80000]"
          >
            Sign in
          </a>
        </div>

        <button
          type="button"
          className="text-[#666666] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#E5E5E5] bg-white px-6 py-4 lg:hidden">
          <ul className="space-y-3">
            {navLinks.map((link) => {
              const href = navHref[link.label] ?? routes.home;

              return (
              <li key={link.label}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-[#333333]"
                >
                  {link.label}
                </Link>
              </li>
              );
            })}
            <li>
              <a
                href={siteConfig.adminUrl}
                className="inline-flex rounded-lg bg-[#CC0000] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Sign in
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
