import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import {
  defaultRentalSearchValues,
  rentalSearchFromQuery,
  rentalSearchToQuery,
} from "@/lib/rental-search";

type LegacyCheckoutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LegacyCheckoutPage({ searchParams }: LegacyCheckoutPageProps) {
  const params = await searchParams;
  const slug = typeof params.slug === "string" ? params.slug : undefined;

  if (!slug) {
    redirect(routes.vehicles);
  }

  const incoming = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "slug" || typeof value !== "string") {
      continue;
    }
    incoming.set(key, value);
  }

  const query = rentalSearchToQuery({
    ...defaultRentalSearchValues(),
    ...rentalSearchFromQuery(incoming),
  }).toString();

  redirect(query ? routes.book(slug, query) : routes.book(slug));
}
