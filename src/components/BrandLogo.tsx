import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

type BrandLogoProps = {
  href?: string;
  className?: string;
  height?: number;
  onDark?: boolean;
};

export function BrandLogo({
  href = "/",
  className = "",
  height = 48,
  onDark = false,
}: BrandLogoProps) {
  const width = Math.round(height * 1.2);
  const imageClass = onDark
    ? "object-contain object-left drop-shadow-[0_0_10px_rgba(255,255,255,0.95)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
    : "object-contain object-left";

  const image = (
    <span
      className="relative inline-block shrink-0"
      style={{ height, width }}
    >
      <Image
        src={siteConfig.logo}
        alt={siteConfig.name}
        fill
        className={imageClass}
        sizes={`${width}px`}
        priority
      />
    </span>
  );

  if (!href) {
    return <span className={`inline-flex shrink-0 ${className}`.trim()}>{image}</span>;
  }

  return (
    <Link
      href={href}
      aria-label={siteConfig.name}
      className={`inline-flex shrink-0 transition-opacity hover:opacity-90 ${className}`.trim()}
    >
      {image}
    </Link>
  );
}
