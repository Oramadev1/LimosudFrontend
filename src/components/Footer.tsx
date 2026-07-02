import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export default async function Footer() {
  const t = await getTranslations("footer");

  const navLinks = [
    { label: t("vehicles"), href: routes.vehicles },
    { label: t("about"), href: routes.about },
    { label: t("blog"), href: routes.blog },
    { label: t("contact"), href: routes.contact },
    { label: t("terms"), href: routes.terms },
  ];

  const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;
  const secondaryPhoneHref = `tel:${siteConfig.secondaryPhone.replace(/\s/g, "")}`;

  return (
    <footer className="border-t border-[#ECECEC] bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-[#E8192C]">{siteConfig.brand}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#666]">
              {t("description")}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-[#1A1A1A] uppercase">
              {t("navigation")}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#666] transition hover:text-[#CC0000]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-[#1A1A1A] uppercase">
              {t("contactUs")}
            </h4>
            <ul className="space-y-3 text-sm text-[#666]">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#E8192C]" />
                <span>
                  {siteConfig.address}
                  <br />
                  {t("countrySuffix")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-[#E8192C]" />
                <span>
                  <a href={phoneHref} className="hover:text-[#CC0000]">
                    {siteConfig.phone}
                  </a>
                  {" · "}
                  <a href={secondaryPhoneHref} className="hover:text-[#CC0000]">
                    {siteConfig.secondaryPhone}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-[#E8192C]" />
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-[#CC0000]"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
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
