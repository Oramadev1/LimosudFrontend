"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { publicCarImageLabel } from "@/lib/public-car-images";

const ROTATION_MS = 4000;

export function HeroCarShowcase({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % images.length);
        setVisible(true);
      }, 300);
    }, ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  const activeSrc = images[index] ?? images[0];
  const label = publicCarImageLabel(activeSrc);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F5F5F5] via-white to-red-50 px-4 py-6">
      <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-[#E8192C]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#1C1C2E]/5 blur-2xl" />

      <div className="relative mx-auto h-48 sm:h-56 lg:h-64">
        <Image
          key={activeSrc}
          src={activeSrc}
          alt={label}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 560px"
          className={`object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out ${
            visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
          }`}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p
          className={`text-sm font-semibold text-[#1A1A1A] transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </p>
        <div className="flex items-center gap-1.5">
          {images.map((src, dotIndex) => (
            <button
              key={src}
              type="button"
              aria-label={`Show ${publicCarImageLabel(src)}`}
              onClick={() => {
                setVisible(false);
                window.setTimeout(() => {
                  setIndex(dotIndex);
                  setVisible(true);
                }, 200);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIndex === index
                  ? "w-6 bg-[#E8192C]"
                  : "w-2 bg-[#E5E5E5] hover:bg-[#CCC]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
