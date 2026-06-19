import CheckoutPageClient from "@/components/CheckoutPageClient";
import { createMetadata } from "@/lib/seo/metadata";
import { routes } from "@/config/routes";

export const metadata = createMetadata({
  title: "Book your vehicle",
  description:
    "Complete your car rental booking. Fill in your billing and rental details to confirm your reservation.",
  path: "/book",
  noIndex: true,
});

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  return <CheckoutPageClient slug={slug} />;
}
