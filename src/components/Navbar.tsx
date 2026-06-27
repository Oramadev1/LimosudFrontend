"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { routes } from "@/config/routes";

const navItems = [
  { key: "home" as const, href: routes.home },
  { key: "vehicles" as const, href: routes.vehicles },
  { key: "blog" as const, href: routes.blog },
  { key: "contact" as const, href: "#contact" },
];

function isNavActive(pathname: string, key: (typeof navItems)[number]["key"]): boolean {
  if (key === "home") {
    return pathname === routes.home;
  }

  if (key === "vehicles") {
    return pathname.startsWith(routes.vehicles) || pathname.startsWith("/book");
  }

  if (key === "blog") {
    return pathname.startsWith(routes.blog);
  }

  return false;
}

export default function Navbar() {
  const t = useTranslations("nav");
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
      <div className="mx-auto flex h-[100px] max-w-[1200px] items-center justify-between gap-4 px-6">
        <BrandLogo href={routes.home} height={72} onDark={overlayOnHero} />

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isNavActive(pathname, item.key);

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
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
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher onDark={overlayOnHero} />
        </div>

        <button
          type="button"
          className={
            overlayOnHero
              ? "text-white drop-shadow md:hidden"
              : "text-[#666666] md:hidden"
          }
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? t("closeMenu") : t("openMenu")}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className={`px-6 pb-4 md:hidden ${overlayOnHero ? "bg-transparent" : "border-t border-[#E5E5E5] bg-white"}`}>
          <div className="mb-4">
            <LanguageSwitcher onDark={overlayOnHero} />
          </div>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium drop-shadow ${
                    overlayOnHero ? "text-white" : "text-[#333333]"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
