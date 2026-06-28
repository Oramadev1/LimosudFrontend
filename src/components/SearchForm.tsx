"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import { useLocationsQuery } from "@/lib/query/hooks";
import {
  buildVehiclesSearchUrl,
  defaultRentalSearchValues,
  fromDatetimeLocal,
  isRentalSearchComplete,
  isRentalSearchPeriodValid,
  rentalSearchFromQuery,
  toDatetimeLocal,
  type RentalSearchValues,
} from "@/lib/rental-search";
import { useSubmitLock } from "@/lib/use-submit-lock";
import type { Location } from "@/types/api";

type SearchFormProps = {
  id?: string;
  className?: string;
  variant?: "default" | "embedded" | "heroFooter";
};

function mergeSearchValues(
  locations: Location[],
  overrides?: Partial<RentalSearchValues>,
): RentalSearchValues {
  const defaults = defaultRentalSearchValues();
  const firstLocationId = locations[0] ? String(locations[0].id) : "";

  return {
    ...defaults,
    pickupLocationId: firstLocationId,
    dropoffLocationId: firstLocationId,
    ...overrides,
  };
}

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
      {children}
    </label>
  );
}

export default function SearchForm({
  id = "book",
  className = "",
  variant = "default",
}: SearchFormProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: locations = [], isPending, isError } = useLocationsQuery();
  const embedded = variant === "embedded";
  const heroFooter = variant === "heroFooter";

  const initialValues = useMemo(
    () => mergeSearchValues(locations, rentalSearchFromQuery(searchParams)),
    [locations, searchParams],
  );

  const [pickupLocationId, setPickupLocationId] = useState(initialValues.pickupLocationId);
  const [dropoffLocationId, setDropoffLocationId] = useState(initialValues.dropoffLocationId);
  const [sameLocation, setSameLocation] = useState(
    initialValues.pickupLocationId === initialValues.dropoffLocationId,
  );
  const [pickupDatetime, setPickupDatetime] = useState(
    toDatetimeLocal(initialValues.pickupDate, initialValues.pickupTime),
  );
  const [dropoffDatetime, setDropoffDatetime] = useState(
    toDatetimeLocal(initialValues.dropoffDate, initialValues.dropoffTime),
  );
  const [error, setError] = useState<string | null>(null);
  const { runOnce, busy } = useSubmitLock();

  useEffect(() => {
    if (!locations.length) {
      return;
    }

    const merged = mergeSearchValues(locations, rentalSearchFromQuery(searchParams));
    setPickupLocationId(merged.pickupLocationId);
    setDropoffLocationId(merged.dropoffLocationId);
    setSameLocation(merged.pickupLocationId === merged.dropoffLocationId);
    setPickupDatetime(toDatetimeLocal(merged.pickupDate, merged.pickupTime));
    setDropoffDatetime(toDatetimeLocal(merged.dropoffDate, merged.dropoffTime));
  }, [locations, searchParams]);

  useEffect(() => {
    if (sameLocation) {
      setDropoffLocationId(pickupLocationId);
    }
  }, [sameLocation, pickupLocationId]);

  const minPickupDatetime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    void runOnce(async () => {
      setError(null);

      const pickup = fromDatetimeLocal(pickupDatetime);
      const dropoff = fromDatetimeLocal(dropoffDatetime);
      const values: RentalSearchValues = {
        pickupLocationId,
        dropoffLocationId: sameLocation ? pickupLocationId : dropoffLocationId,
        pickupDate: pickup.date,
        pickupTime: pickup.time,
        dropoffDate: dropoff.date,
        dropoffTime: dropoff.time,
      };

      if (!isRentalSearchComplete(values)) {
        setError(t("incomplete"));
        return;
      }

      if (!isRentalSearchPeriodValid(values)) {
        setError(t("invalidPeriod"));
        return;
      }

      router.push(buildVehiclesSearchUrl(values));
    });
  }

  const fieldClass =
    "booking-field w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

  const shellClass =
    embedded || heroFooter
      ? ""
      : "rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 lg:p-6";

  const submitClass =
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#CC0000] px-5 text-sm font-semibold text-white transition hover:bg-[#a80000] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500";

  const gridClass = embedded
    ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
    : heroFooter
      ? "grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-3"
      : "grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-12 xl:items-end xl:gap-3";

  const pickupColClass = embedded
    ? "min-w-0"
    : heroFooter
      ? "min-w-0 sm:col-span-2 lg:col-span-4"
      : "min-w-0 sm:col-span-2 xl:col-span-4";

  const dateColClass = embedded ? "min-w-0" : heroFooter ? "min-w-0 lg:col-span-3" : "min-w-0 xl:col-span-3";

  const submitColClass = embedded
    ? "min-w-0 sm:col-span-2 lg:col-span-1"
    : heroFooter
      ? "min-w-0 sm:col-span-2 lg:col-span-2"
      : "min-w-0 sm:col-span-2 xl:col-span-2";

  return (
    <section id={id} className={`min-w-0 max-w-full ${shellClass} ${className}`.trim()}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {embedded ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("step")}
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {t("whenWhere")}
            </h2>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <button
                type="button"
                role="switch"
                aria-checked={sameLocation}
                aria-label={t("sameDropoff")}
                onClick={() => setSameLocation((value) => !value)}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                  sameLocation ? "bg-slate-900" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    sameLocation ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              {t("sameDropoff")}
            </label>
          </div>
        ) : heroFooter ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t("title")}</h2>
              <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
            </div>
            <label className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={sameLocation}
                onChange={(event) => setSameLocation(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#CC0000] focus:ring-[#CC0000]"
              />
              {t("sameLocation")}
            </label>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t("title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
          </div>
        )}

        {!embedded && !heroFooter ? (
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={sameLocation}
              onChange={(event) => setSameLocation(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            {t("sameLocation")}
          </label>
        ) : null}

        {isError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {t("locationsError")}
          </p>
        ) : null}

        {!isPending && locations.length === 0 ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {t("noLocations")}
          </p>
        ) : null}

        <div className={gridClass}>
          <div className={pickupColClass}>
            <FieldLabel>{t("pickupLocation")}</FieldLabel>
            <div className="relative">
              <MapPin
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <select
                value={pickupLocationId}
                onChange={(event) => setPickupLocationId(event.target.value)}
                disabled={isPending || locations.length === 0}
                className={`${fieldClass} pl-9`}
                required
              >
                {isPending ? <option value="">{t("loading")}</option> : null}
                {locations.map((location) => (
                  <option key={location.id} value={String(location.id)}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={dateColClass}>
            <FieldLabel>{t("pickupDate")}</FieldLabel>
            <div className="relative">
              <Calendar
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="datetime-local"
                value={pickupDatetime}
                min={minPickupDatetime}
                onChange={(event) => setPickupDatetime(event.target.value)}
                className={`${fieldClass} pl-9`}
                required
              />
            </div>
          </div>

          <div className={dateColClass}>
            <FieldLabel>{t("dropoffDate")}</FieldLabel>
            <div className="relative">
              <Calendar
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="datetime-local"
                value={dropoffDatetime}
                min={pickupDatetime || minPickupDatetime}
                onChange={(event) => setDropoffDatetime(event.target.value)}
                className={`${fieldClass} pl-9`}
                required
              />
            </div>
          </div>

          <div className={submitColClass}>
            <button
              type="submit"
              disabled={busy || isPending || locations.length === 0}
              className={submitClass}
            >
              {t("search")}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {!sameLocation ? (
          <div className={`min-w-0 ${embedded ? "sm:max-w-xs" : heroFooter ? "lg:max-w-sm" : "max-w-md"}`}>
            <FieldLabel>{t("dropoffLocation")}</FieldLabel>
            <div className="relative">
              <MapPin
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <select
                value={dropoffLocationId}
                onChange={(event) => setDropoffLocationId(event.target.value)}
                disabled={isPending || locations.length === 0}
                className={`${fieldClass} pl-9`}
                required
              >
                {locations.map((location) => (
                  <option key={location.id} value={String(location.id)}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      </form>
    </section>
  );
}
