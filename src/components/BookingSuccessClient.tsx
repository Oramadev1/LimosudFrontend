"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";

import { routes } from "@/config/routes";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Locale } from "@/i18n/config";

const primaryBtnClass =
  "rounded-full bg-[#3563E9] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2a52c9]";
const secondaryBtnClass =
  "rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50";

function BookingSuccessContent() {
  const t = useTranslations("checkout");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();

  const reservationNumber = searchParams.get("reservation_number");
  const vehicleName = searchParams.get("vehicle_name");
  const startDatetime = searchParams.get("start_datetime");
  const endDatetime = searchParams.get("end_datetime");
  const totalPrice = searchParams.get("total_price");
  const totalDays = searchParams.get("total_days");
  const customerName = searchParams.get("customer_name");
  const phone = searchParams.get("phone");
  const email = searchParams.get("email");

  if (!reservationNumber) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-gray-900">{t("successMissingTitle")}</h1>
        <p className="text-gray-600">{t("successMissingBody")}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={routes.vehicles} className={primaryBtnClass}>
            {t("successBrowseVehicles")}
          </Link>
          <Link href={routes.home} className={secondaryBtnClass}>
            {t("successBackHome")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-600" aria-hidden />
        <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">{t("successTitle")}</h1>
        <p className="max-w-md text-gray-600">{t("successSubtitle")}</p>
      </div>

      <dl className="mt-10 space-y-4 border-y border-gray-200 py-8">
        <DetailRow label={t("successReservationNumber")} value={reservationNumber} emphasis />
        {vehicleName ? <DetailRow label={t("successVehicle")} value={vehicleName} /> : null}
        {customerName ? <DetailRow label={t("successCustomer")} value={customerName} /> : null}
        {phone ? <DetailRow label={t("successPhone")} value={phone} /> : null}
        {email ? <DetailRow label={t("successEmail")} value={email} /> : null}
        {startDatetime ? (
          <DetailRow label={t("successPickup")} value={formatDateTime(startDatetime, locale)} />
        ) : null}
        {endDatetime ? (
          <DetailRow label={t("successDropoff")} value={formatDateTime(endDatetime, locale)} />
        ) : null}
        {totalDays ? (
          <DetailRow
            label={t("successDuration")}
            value={`${totalDays} ${Number(totalDays) === 1 ? t("day") : t("days")}`}
          />
        ) : null}
        {totalPrice ? (
          <DetailRow
            label={t("successTotal")}
            value={formatCurrency(totalPrice, locale)}
            emphasis
          />
        ) : null}
      </dl>

      <div className="mt-8 space-y-3 text-center text-sm text-gray-600">
        <p>{t("successContactNote")}</p>
        <p className="font-medium text-gray-900">{t("successCheckEmail")}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href={routes.vehicles} className={primaryBtnClass}>
          {t("successBrowseVehicles")}
        </Link>
        <Link href={routes.home} className={secondaryBtnClass}>
          {t("successBackHome")}
        </Link>
      </div>
    </section>
  );
}

function DetailRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd
        className={
          emphasis
            ? "text-base font-semibold text-gray-900 sm:text-right"
            : "text-base text-gray-900 sm:text-right"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export default function BookingSuccessClient() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-500">…</div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
