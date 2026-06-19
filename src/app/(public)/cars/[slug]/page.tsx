import { redirect } from "next/navigation";

import { routes } from "@/config/routes";

type LegacyCarDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyCarDetailPage({ params }: LegacyCarDetailPageProps) {
  const { slug } = await params;
  redirect(routes.vehicle(slug));
}
