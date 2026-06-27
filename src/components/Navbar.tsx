"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === routes.home;
  const overlayOnHero = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`z-50 ${
        isHome
          ? `fixed inset-x-0 top-0 ${overlayOnHero ? "!bg-transparent shadow-none" : "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"}`
          : "sticky top-0 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-6">
        <BrandLogo href={routes.home} height={44} onDark={overlayOnHero} />

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const href = navHref[link.label] ?? routes.home;
            const active = isNavActive(pathname, link.label);

            return (
              <li key={link.label}>
                <Link
                  href={href}
                  className={
                    overlayOnHero
                      ? `text-sm transition hover:text-[#FF6B6B] ${
                          active
                            ? "border-b-2 border-white pb-1 font-semibold text-white drop-shadow"
                            : "text-white drop-shadow"
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
          className={
            overlayOnHero
              ? "text-white drop-shadow md:hidden"
              : "text-[#666666] md:hidden"
          }
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className={`px-6 pb-4 md:hidden ${overlayOnHero ? "bg-transparent" : "border-t border-[#E5E5E5] bg-white"}`}>
          <ul className="space-y-3">
            {navLinks.map((link) => {
              const href = navHref[link.label] ?? routes.home;

              return (
                <li key={link.label}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block text-sm font-medium drop-shadow ${
                      overlayOnHero ? "text-white" : "text-[#333333]"
                    }`}
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
