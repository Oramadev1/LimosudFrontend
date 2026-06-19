export const siteConfig = {
  name: "Limosud Cars",
  shortName: "Limosud",
  brand: "LIMOSUD CARS",
  logo: "/logo.jpg",
  description:
    "Renting a car is easy and fast with Limosud Cars. Premium rental fleet in Dakhla.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api",
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001/login",
  locale: "fr_FR",
  language: "en",
  defaultTitle: "Limosud Cars — Rent reputable cars",
  titleTemplate: "%s | Limosud Cars",
  keywords: ["rent car", "car rental", "Limosud Cars", "Dakhla"],
  twitterHandle: "",
  contactEmail: "",
} as const;
