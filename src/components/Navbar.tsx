"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";
import { routes } from "@/config/routes";
import { navLinks } from "@/config/site";

const navHref: Record<string, string> = {
  Accueil: routes.home,
  Véhicules: routes.vehicles,
  Blog: routes.blog,
  Contact: "#contact",
};

function isNavActive(pathname: string, label: string): boolean {
  if (label === "Accueil") {
    return pathname === routes.home;
  }

  if (label === "Véhicules") {
    return pathname.startsWith(routes.vehicles) || pathname.startsWith("/book");
  }

  if (label === "Blog") {
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
        isHome ? "bg-transparent shadow-none" : "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-6">
        <BrandLogo href={routes.home} height={44} />

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const href = navHref[link.label] ?? routes.home;
            const active = isNavActive(pathname, link.label);

            return (
              <li key={link.label}>
                <Link
                  href={href}
                  className={
                    isHome
                      ? `text-sm transition hover:text-[#CC0000] ${
                          active
                            ? "border-b-2 border-white pb-1 font-semibold text-white"
                            : "text-white/90"
                        }`
                      : `text-sm transition hover:text-[#CC0000] ${
                          active
                            ? "border-b-2 border-[#1A1A1A] pb-1 font-semibold text-[#1A1A1A]"
                            : "text-[#666666]"
                        }`
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className={isHome ? "text-white md:hidden" : "text-[#666666] md:hidden"}
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div
          className={`px-6 py-4 md:hidden ${
            isHome ? "bg-white/95 backdrop-blur-sm" : "border-t border-[#E5E5E5] bg-white"
          }`}
        >
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
          </ul>
        </div>
      ) : null}
    </header>
  );
}
