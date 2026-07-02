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

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";

/** Placeholder photos — replace with real Limosud Cars images when ready. */
const aboutImages = {
  hero: "https://images.unsplash.com/photo-1586724190315-6a817a0fdd94?auto=format&fit=crop&w=1800&q=80",
  fleet: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
  dakhla: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  service: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
} as const;

export const metadata = createMetadata({
  title: "À propos — Location de voitures à Dakhla",
  description:
    "Découvrez Limosud Cars, agence de location de voitures et 4x4 à Dakhla. Livraison aéroport, flotte récente, tarifs transparents et assistance 24h/24.",
  path: routes.about,
  keywords: [
    "Limosud Cars",
    "location voiture Dakhla",
    "car rental Dakhla",
    "4x4 Dakhla",
    "aéroport Dakhla",
  ],
});

const highlights = [
  {
    icon: Car,
    title: "Flotte variée",
    text: "Citadines économiques, SUV et 4x4 adaptés aux pistes du littoral et du désert autour de Dakhla.",
  },
  {
    icon: Plane,
    title: "Livraison aéroport",
    text: "Prise en charge à l'aéroport de Dakhla (VIL) ou à votre hôtel — idéal dès votre arrivée au Maroc.",
  },
  {
    icon: Clock,
    title: "Assistance 24h/24",
    text: "Une équipe locale joignable par téléphone et WhatsApp pendant toute la durée de votre location.",
  },
  {
    icon: ShieldCheck,
    title: "Réservation simple",
    text: "Devis clair, assurance incluse selon formule, kilométrage adapté à la région Dakhla-Oued Ed-Dahab.",
  },
];

const services = [
  {
    title: "Location courte ou longue durée",
    text: "Week-end kitesurf, séjour d'une semaine ou location mensuelle pour résidents et professionnels.",
  },
  {
    title: "Transfert aéroport",
    text: "Récupérez votre véhicule dès l'atterrissage et rejoignez la lagune, le centre-ville ou votre camp sans attente.",
  },
  {
    title: "Découverte de la région",
    text: "Partez à votre rythme vers la Dune Blanche, la lagune, PK25 ou les plages sauvages de la presqu'île.",
  },
];

const destinations = [
  "Lagune de Dakhla et spots de kitesurf",
  "PK25 et camps au bord de l'eau",
  "Dune Blanche et paysages désert-atlantique",
  "Centre-ville, port et zones hôtelières",
  "Routes vers la presqu'île et Foum El Bouir",
];

export default function AboutPage() {
  const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;
  const secondaryPhoneHref = `tel:${siteConfig.secondaryPhone.replace(/\s/g, "")}`;

  return (
    <div className="bg-[#F5F5F5]">
      <section className="relative min-h-[420px] overflow-hidden sm:min-h-[480px]">
        <Image
          src={aboutImages.hero}
          alt="Côte atlantique et désert près de Dakhla"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
        <div className="relative mx-auto flex min-h-[420px] max-w-[1200px] items-center px-6 py-16 sm:min-h-[480px]">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#FF6B6B] uppercase">
              {siteConfig.brand}
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">
              Votre partenaire location à Dakhla
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg">
              Limosud Cars est une agence de location de voitures de confiance à Dakhla, au cœur de la
              région Dakhla-Oued Ed-Dahab. Nous mettons à disposition des véhicules récents, un service
              humain et une livraison rapide pour explorer lagunes, dunes et côte atlantique en toute
              liberté.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#E8192C]">
              <Sparkles size={16} />
              Notre histoire
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">
              Une équipe locale au service des voyageurs
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">
              Installés à Dakhla, nous accompagnons touristes, kitesurfeurs, familles et professionnels
              qui ont besoin d&apos;une voiture fiable dès leur arrivée. Notre connaissance du terrain —
              routes goudronnées, pistes lagunaires et conditions du désert côtier — nous permet de vous
              conseiller le véhicule adapté à votre séjour.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">
              Que vous rejoigniez un camp à PK25, un hôtel sur la lagune ou le centre-ville, nous
              simplifions la réservation : choix du véhicule en ligne, prise en charge à l&apos;aéroport ou
              à l&apos;agence, et accompagnement en français, arabe ou anglais selon vos besoins.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">
              Limosud Cars s&apos;inscrit dans la dynamique touristique de Dakhla, destination reconnue pour
              son vent constant, ses eaux turquoise et ses horizons entre océan et Sahara. Louer chez nous,
              c&apos;est gagner en autonomie pour vivre la région sans dépendre des horaires de taxi.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <Image
              src={aboutImages.service}
              alt="Remise des clés — service client Limosud Cars"
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
            <h2 className="text-3xl font-bold text-[#1A1A1A]">Pourquoi choisir Limosud Cars ?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-[#666] sm:text-base">
              Des prestations pensées pour Dakhla : proximité, réactivité et véhicules entretenus pour la
              route comme pour les pistes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, text }) => (
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
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] lg:order-1">
            <Image
              src={aboutImages.fleet}
              alt="SUV et 4x4 pour les routes de Dakhla"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="lg:order-2">
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#E8192C]">
              <Car size={16} />
              Notre flotte
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">
              Citadines, SUV et 4x4 pour chaque voyage
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">
              Pour un séjour urbain ou des trajets sur route goudronnée, une citadine ou un compact
              suffit souvent. Pour la lagune, les pistes sablonneuses ou les sorties vers la dune, un SUV
              type Dacia Duster ou un 4x4 offre garde au sol, confort et espace pour bagages et matériel
              de sport.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">
              Chaque véhicule est préparé avant remise : contrôle, propreté et explications sur
              l&apos;assurance et les conditions de circulation dans la région Dakhla-Oued Ed-Dahab.
            </p>
            <Link
              href={routes.vehicles}
              className="mt-6 inline-flex rounded bg-[#E8192C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Voir les véhicules disponibles
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
                Explorer Dakhla
              </div>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">
                Une destination unique entre océan et désert
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#555] sm:text-base">
                Dakhla séduit par sa lagune abritée, ses spots de kitesurf mondialement connus et ses
                panoramas où le sable rencontre l&apos;Atlantique. Avec une voiture de location, vous
                programmez vos journées librement : lever de soleil sur la dune, session sport, marché local
                ou route panoramique le long de la baie.
              </p>
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
                alt="Paysages et lagune de Dakhla"
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
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Nos services</h2>
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
              <h2 className="text-3xl font-bold">Nous trouver</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                Agence à Dakhla, livraison possible à l&apos;aéroport international Dakhla (VIL) et dans
                les principales zones hôtelières. Nous couvrons la région Dakhla-Oued Ed-Dahab pour vos
                déplacements touristiques et professionnels.
              </p>
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
              <p className="text-sm text-white/75">
                Prêt à réserver ? Parcourez notre flotte ou contactez-nous pour un devis personnalisé.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={routes.vehicles}
                  className="inline-flex rounded bg-[#E8192C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Réserver un véhicule
                </Link>
                <Link
                  href={routes.contact}
                  className="inline-flex rounded border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
