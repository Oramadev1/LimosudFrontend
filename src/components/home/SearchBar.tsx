"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DollarSign, MapPin, Users } from "lucide-react";

import { routes } from "@/config/routes";

export function SearchBar() {
  const router = useRouter();
  const [mode, setMode] = useState<"rent" | "buy">("rent");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (seats) params.set("seats", seats);
    if (price) params.set("max_price", price);
    if (location) params.set("q", location);
    const query = params.toString();
    router.push(query ? `${routes.vehicles}?${query}` : routes.vehicles);
  }

  return (
    <div className="relative z-10 mx-auto -mt-6 max-w-[1100px] rounded-xl bg-white px-6 py-5 shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={() => setMode("rent")}
          className={`rounded px-5 py-2 text-sm font-medium transition ${
            mode === "rent"
              ? "bg-[#1C1C2E] text-white"
              : "text-[#888] hover:text-[#1A1A1A]"
          }`}
        >
          Louer
        </button>
        <button
          type="button"
          onClick={() => setMode("buy")}
          className={`rounded px-3 py-2 text-sm transition ${
            mode === "buy"
              ? "bg-[#1C1C2E] text-white"
              : "text-[#888] hover:text-[#1A1A1A]"
          }`}
        >
          Acheter
        </button>
      </div>

      <div className="flex flex-col overflow-hidden rounded-lg border border-[#E5E5E5] sm:flex-row sm:items-stretch">
        <label className="flex flex-1 items-center gap-2 border-b border-[#E5E5E5] px-4 py-3 sm:border-r sm:border-b-0">
          <Users className="h-4 w-4 shrink-0 text-[#888]" />
          <input
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            placeholder="Nombre de places"
            className="w-full bg-transparent text-sm text-[#555] outline-none"
          />
        </label>
        <label className="flex flex-1 items-center gap-2 border-b border-[#E5E5E5] px-4 py-3 sm:border-r sm:border-b-0">
          <DollarSign className="h-4 w-4 shrink-0 text-[#888]" />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Prix max"
            className="w-full bg-transparent text-sm text-[#555] outline-none"
          />
        </label>
        <label className="flex flex-1 items-center gap-2 border-b border-[#E5E5E5] px-4 py-3 sm:border-r sm:border-b-0 sm:border-b-0">
          <MapPin className="h-4 w-4 shrink-0 text-[#888]" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lieu"
            className="w-full bg-transparent text-sm text-[#555] outline-none"
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          className="shrink-0 bg-[#E8192C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Rechercher
        </button>
      </div>
    </div>
  );
}
