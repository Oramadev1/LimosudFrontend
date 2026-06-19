import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

type BrandLogoProps = {
  href?: string;
  className?: string;
  height?: number;
};

export function BrandLogo({ href = "/", className = "", height = 48 }: BrandLogoProps) {
  const width = Math.round(height * 2.4);

  const image = (
    <span
      className="relative inline-block shrink-0"
      style={{ height, width }}
    >
      <Image
        src={siteConfig.logo}
        alt={siteConfig.name}
        fill
        className="object-contain object-left"
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
      className={`inline-flex shrink-0 transition-opacity hover:opacity-90 ${className}`.trim()}
    >
      {image}
    </Link>
  );
}
