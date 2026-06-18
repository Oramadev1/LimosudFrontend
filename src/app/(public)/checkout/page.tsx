import { redirect } from "next/navigation";

import CheckoutPageClient from "@/components/CheckoutPageClient";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Checkout",
  description:
    "Complete your car rental booking. Fill in your billing and rental details to confirm your reservation.",
  path: "/checkout",
  noIndex: true,
});

type CheckoutPageProps = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { slug } = await searchParams;

  if (!slug) {
    redirect("/cars");
  }

  return <CheckoutPageClient slug={slug} />;
}
