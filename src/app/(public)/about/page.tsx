import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Clock,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { intlLocale } from "@/lib/i18n/locale-tags";
import { createMetadata } from "@/lib/seo/metadata";

const ABOUT_IMAGES_DIR = "/aboutpageimages";

function localAboutImage(fileName: string): string {
  return `${ABOUT_IMAGES_DIR}/${encodeURIComponent(fileName)}`;
}

const aboutImages = {
  hero: localAboutImage("heroimage.png"),
  history: localAboutImage("Notre histoire image.png"),
  fleet: localAboutImage("Notre flotte image.jpeg"),
  dakhla: localAboutImage("Explorer Dakhla.webp"),
} as const;

const highlightIcons = [Car, Plane, Clock, ShieldCheck] as const;

export async function generateMetadata() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("about");

  return createMetadata({
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    path: routes.about,
    locale: intlLocale(locale),
    keywords: [
      "Limosud Cars",
      "location voiture Dakhla",
      "car rental Dakhla",
      "4x4 Dakhla",
      "aéroport Dakhla",
    ],
  });
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const highlights = t.raw("highlights") as Array<{ title: string; text: string }>;
  const destinations = t.raw("destinations") as string[];
  const services = t.raw("services") as Array<{ title: string; text: string }>;
  const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;
  const secondaryPhoneHref = `tel:${siteConfig.secondaryPhone.replace(/\s/g, "")}`;

  return (
    <div className="bg-[#F5F5F5]">
      <section className="relative min-h-[420px] overflow-hidden sm:min-h-[480px]">
        <Image
          src={aboutImages.hero}
          alt={t("heroAlt")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
        <div className="relative mx-auto flex min-h-[420px] max-w-[1200px] items-center px-6 py-16 sm:min-h-[480px]">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#FF6B6B] uppercase">
              {t("heroBrand")}
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg">
              {t("heroText")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#E8192C]">
              <Sparkles size={16} />
              {t("historyLabel")}
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">{t("historyTitle")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">{t("historyP1")}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">{t("historyP2")}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">{t("historyP3")}</p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <Image
              src={aboutImages.history}
              alt={t("historyAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-[#1A1A1A]">{t("whyTitle")}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#666] sm:text-base">{t("whySubtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ title, text }, index) => {
              const Icon = highlightIcons[index] ?? Car;

              return (
                <div
                  key={title}
                  className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-[#E8192C]/10 p-3 text-[#E8192C]">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#666]">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] lg:order-1">
            <Image
              src={aboutImages.fleet}
              alt={t("fleetAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="lg:order-2">
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#E8192C]">
              <Car size={16} />
              {t("fleetLabel")}
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">{t("fleetTitle")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">{t("fleetP1")}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">{t("fleetP2")}</p>
            <Link
              href={routes.vehicles}
              className="mt-6 inline-flex rounded bg-[#E8192C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              {t("fleetCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#E8192C]">
                <MapPin size={16} />
                {t("exploreLabel")}
              </div>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">{t("exploreTitle")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">{t("exploreText")}</p>
              <ul className="mt-6 space-y-3">
                {destinations.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#555] sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8192C]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              <Image
                src={aboutImages.dakhla}
                alt={t("exploreTitle")}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <Users className="text-[#E8192C]" size={24} />
            <h2 className="text-2xl font-bold text-[#1A1A1A]">{t("servicesTitle")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-xl bg-[#FAFAFA] p-5">
                <h3 className="font-bold text-[#1A1A1A]">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#666]">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1A1A1A] py-16 text-white">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">{t("findTitle")}</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">{t("findText")}</p>
              <div className="mt-6 space-y-3 text-sm sm:text-base">
                <p className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-[#FF6B6B]" />
                  {siteConfig.address}, Dakhla 73000, Maroc
                </p>
                <p>
                  <a href={phoneHref} className="font-medium text-white hover:text-[#FF6B6B]">
                    {siteConfig.phone}
                  </a>
                  {" · "}
                  <a href={secondaryPhoneHref} className="font-medium text-white hover:text-[#FF6B6B]">
                    {siteConfig.secondaryPhone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="font-medium text-white hover:text-[#FF6B6B]"
                  >
                    {siteConfig.contactEmail}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={routes.vehicles}
                  className="inline-flex rounded bg-[#E8192C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  {t("findCtaBook")}
                </Link>
                <Link
                  href={routes.contact}
                  className="inline-flex rounded border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {t("findCtaContact")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
