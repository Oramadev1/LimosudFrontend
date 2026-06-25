import { Car, Headphones, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Fiabilité garantie",
    description:
      "Tous nos véhicules sont inspectés et entretenus avant chaque location pour garantir votre sécurité.",
  },
  {
    icon: Car,
    title: "Large choix de véhicules",
    description:
      "Des citadines aux SUV, nous proposons une flotte adaptée à tous vos besoins à Dakhla.",
  },
  {
    icon: Headphones,
    title: "Service client 24/7",
    description:
      "Notre équipe est disponible à toute heure pour vous accompagner et répondre à vos questions.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-[#F5F5F5] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-12 text-center text-2xl font-bold tracking-wide text-[#1A1A1A] uppercase">
          Pourquoi nous choisir
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center p-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8192C]/10">
                <Icon className="h-7 w-7 text-[#E8192C]" />
              </div>
              <h3 className="mb-2 text-base font-bold text-[#1A1A1A]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#666]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
