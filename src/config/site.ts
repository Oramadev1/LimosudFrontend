export const siteConfig = {
  name: "Limosud Cars",
  shortName: "Limosud",
  brand: "LIMOSUD CARS",
  logo: "/logo.png",
  heroBanner: "/heroandnavbarimge.jpeg",
  description:
    "Louer une voiture est simple et rapide avec Limosud Cars. Flotte premium à Dakhla.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://api.limosudcars.com/api",
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001/login",
  locale: "fr_FR",
  language: "fr",
  defaultTitle: "Limosud Cars — Louez des voitures de confiance",
  titleTemplate: "%s | Limosud Cars",
  keywords: ["location voiture", "car rental", "Limosud Cars", "Dakhla"],
  twitterHandle: "",
  contactEmail: "Limosudcars@gmail.com",
  phone: "06 61 04 09 67",
  address: "Hay alqods N10 - Dakhla",
} as const;

export const heroStats = [
  { value: "50+", label: "Marques" },
  { value: "10k+", label: "Clients" },
] as const;

export const navLinks = [
  { label: "Accueil" },
  { label: "Véhicules" },
  { label: "Blog" },
  { label: "Contact" },
] as const;
