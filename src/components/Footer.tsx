import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Globe, Link2, Mail, MessageCircle, Share2 } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

const socialIcons = [Share2, Globe, MessageCircle, Mail, Link2];

export default async function Footer() {
  const t = await getTranslations("footer");

  const fleetLinks = [
    { label: t("vehicles"), href: routes.vehicles },
    { label: t("booking"), href: routes.vehicles },
    { label: t("rental"), href: routes.vehicles },
  ];

  const serviceLinks = [
    { label: t("delivery"), href: "#" },
    { label: t("insurance"), href: "#" },
    { label: t("warranty"), href: "#" },
    { label: t("financing"), href: "#" },
  ];

  const companyLinks = [
    { label: t("about"), href: routes.home },
    { label: t("blog"), href: routes.blog },
    { label: t("contact"), href: "#contact" },
    { label: t("terms"), href: routes.terms },
  ];

  return (
    <footer className="border-t border-[#E5E5E5] bg-white py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-3 text-lg font-bold text-[#E8192C]">{siteConfig.brand}</p>
            <p className="mb-4 text-xs leading-relaxed text-[#666]">{t("description")}</p>
            <div className="flex gap-2">
              {socialIcons.map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] text-[#888] transition hover:border-[#888] hover:text-[#333]"
                  aria-label={t("social")}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#1A1A1A]">{t("fleet")}</h4>
            <ul className="space-y-2">
              {fleetLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="block text-sm text-[#666] transition hover:text-[#1A1A1A]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#1A1A1A]">{t("services")}</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="block text-sm text-[#666] transition hover:text-[#1A1A1A]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#1A1A1A]">{t("company")}</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="block text-sm text-[#666] transition hover:text-[#1A1A1A]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E5E5E5] pt-6 text-center">
          <p className="text-xs text-[#999]">
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
