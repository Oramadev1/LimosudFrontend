import { ContactSection } from "@/components/home/ContactSection";
import { routes } from "@/config/routes";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact — Location de voitures à Dakhla",
  description:
    "Contactez Limosud Cars à Dakhla. Réservation, devis et assistance par téléphone, email ou formulaire en ligne.",
  path: routes.contact,
});

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-[#ECECEC] bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1200px] px-6 py-12 text-center sm:py-14">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#E8192C] uppercase">
            Limosud Cars
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">Contact</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#666] sm:text-base">
            Une question sur une location, un devis ou une livraison à l&apos;aéroport ? Écrivez-nous
            ou appelez notre équipe à Dakhla.
          </p>
        </div>
      </div>
      <ContactSection showHeading={false} />
    </div>
  );
}
