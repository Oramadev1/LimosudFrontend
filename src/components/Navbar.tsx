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
  { key: "about" as const, href: routes.about },
  { key: "blog" as const, href: routes.blog },
  { key: "contact" as const, href: routes.contact },
];

function isNavActive(pathname: string, key: (typeof navItems)[number]["key"]): boolean {
  if (key === "home") return pathname === routes.home;
  if (key === "vehicles") {
    return pathname.startsWith(routes.vehicles) || pathname.startsWith("/book");
  }
  if (key === "about") return pathname.startsWith(routes.about);
  if (key === "blog") return pathname.startsWith(routes.blog);
  if (key === "contact") return pathname.startsWith(routes.contact);
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

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const shellClass = overlayOnHero
    ? "border-white/25 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl"
    : "border-black/[0.06] bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl";

  const linkBase = overlayOnHero
    ? "text-white/90 hover:bg-white/15 hover:text-white"
    : "text-[#444] hover:bg-[#F3F4F6] hover:text-[#111]";

  const linkActive = overlayOnHero
    ? "bg-white/20 font-semibold text-white shadow-sm"
    : "bg-[#FFF0F0] font-semibold text-[#CC0000]";

  return (
    <>
      <header
        className={`z-50 ${
          isHome
            ? `fixed inset-x-0 top-0 ${overlayOnHero ? "pt-4" : "pt-3"}`
            : "sticky top-0 pt-3"
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <nav
            className={`flex h-[68px] items-center justify-between gap-3 rounded-2xl border px-3 sm:gap-4 sm:px-5 ${shellClass}`}
          >
            <BrandLogo href={routes.home} height={52} onDark={overlayOnHero} />

            <ul className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const active = isNavActive(pathname, item.key);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={`rounded-full px-4 py-2 text-sm transition ${active ? linkActive : linkBase}`}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center gap-2 lg:flex">
              <LanguageSwitcher onDark={overlayOnHero} />
              <Link
                href={routes.vehicles}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  overlayOnHero
                    ? "bg-white text-[#111] hover:bg-white/90"
                    : "bg-[#CC0000] text-white hover:bg-[#a80000]"
                }`}
              >
                {t("rentCta")}
              </Link>
            </div>

            <button
              type="button"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition lg:hidden ${
                overlayOnHero
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-[#F3F4F6] text-[#333] hover:bg-[#ECECEC]"
              }`}
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
          />
          <div className="absolute inset-x-4 top-[92px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-2xl">
            <div className="border-b border-[#F0F0F0] px-5 py-4">
              <LanguageSwitcher />
            </div>
            <ul className="space-y-1 p-3">
              {navItems.map((item) => {
                const active = isNavActive(pathname, item.key);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-base font-medium transition ${
                        active
                          ? "bg-[#FFF0F0] text-[#CC0000]"
                          : "text-[#333] hover:bg-[#F8F8F8]"
                      }`}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-[#F0F0F0] p-4">
              <Link
                href={routes.vehicles}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-[#CC0000] py-3 text-sm font-semibold text-white"
              >
                {t("rentCta")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
