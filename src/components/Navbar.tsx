"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

const navLinks = [
  { href: routes.home, label: "Accueil" },
  { href: routes.vehicles, label: "Véhicules" },
  { href: routes.blog, label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href={routes.home} className="text-lg font-bold tracking-wide text-[#E8192C]">
          {siteConfig.brand}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === routes.home ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`text-sm transition hover:text-[#E8192C] ${
                    active
                      ? "border-b-2 border-[#1A1A1A] pb-1 font-semibold text-[#1A1A1A]"
                      : "text-[#666]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="text-[#666] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#E5E5E5] bg-white px-6 py-4 md:hidden">
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-[#333]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
