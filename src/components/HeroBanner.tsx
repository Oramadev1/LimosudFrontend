import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  bgFrom: string;
  bgTo: string;
  carImage: string;
  carAlt: string;
  delay?: number;
  priority?: boolean;
}

function BannerCard({ title, subtitle, buttonText, bgFrom, bgTo, carImage, carAlt, delay = 0, priority = false }: BannerProps) {
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className="animate-fade-in-up relative flex-1 rounded-[10px] overflow-hidden h-[280px] flex flex-col justify-between p-8"
      aria-label={title}
    >
      <div style={{ background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})` }} className="absolute inset-0" />

      {/* Text */}
      <div
        style={{ animationDelay: `${delay + 0.15}s` }}
        className="animate-fade-in-left max-w-[220px] z-10 relative"
      >
        <h2 className="text-white font-semibold text-2xl leading-snug mb-2">{title}</h2>
        <p className="text-white/80 text-xs leading-relaxed mb-6">{subtitle}</p>
        <Link href="/cars" className="inline-block bg-[#3563E9] hover:bg-[#2a52c9] transition-colors text-white text-sm font-semibold px-5 py-2.5 rounded-[4px] relative left-1">
          {buttonText}
        </Link>
      </div>

      {/* Car Image */}
      <div
        style={{ animationDelay: `${delay + 0.2}s` }}
        className="animate-fade-in-right absolute bottom-0 right-4 w-[300px] h-[160px]"
      >
        <Image
          src={carImage}
          alt={carAlt}
          fill
          priority={priority}
          sizes="300px"
          className="object-contain object-right-bottom drop-shadow-2xl"
        />
      </div>
    </div>
  );
}

export default function HeroBanner() {
  return (
    <section className="flex flex-col md:flex-row gap-6">
      <BannerCard
        title="The Best Platform for Car Rental"
        subtitle="Ease of doing a car rental safely and reliably. Of course at a low price."
        buttonText="Rental Car"
        bgFrom="#1C3FA8" bgTo="#3563E9"
        carImage="/koenigsegg.png" carAlt="Koenigsegg"
        delay={0} priority
      />
      <BannerCard
        title="Easy way to rent a car at a low price"
        subtitle="Providing cheap car rental services and safe and comfortable facilities."
        buttonText="Rental Car"
        bgFrom="#1C7EBD" bgTo="#54A6D4"
        carImage="/nissan-gtr.png" carAlt="Nissan GT-R"
        delay={0.1} priority
      />
    </section>
  );
}
