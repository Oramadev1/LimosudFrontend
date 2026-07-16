"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { RentalDateField } from "@/components/RentalDateField";
import StorageImage from "@/components/StorageImage";

import { ApiError, isValidationError } from "@/lib/api/client";
import { checkVehicleAvailability } from "@/lib/api/public";
import {
  createBillingSchema,
  createRentalSchema,
  createConfirmSchema,
  PENDING_CUSTOMER_NATIONALITY,
  isRentalPeriodValid,
  type BillingData,
  type RentalData,
  type ConfirmData,
} from "@/lib/checkout-schema";
import {
  combineDatetime,
  formatCurrency,
} from "@/lib/format";
import { calculateRentalDays, MIN_RENTAL_DAYS } from "@/lib/rental-rules";
import { getVehicleImageUrl } from "@/lib/images";
import { routes } from "@/config/routes";
import { estimateRentalTotal, pricePerDayForRental } from "@/lib/rental-pricing";
import { rentalSearchFromQuery } from "@/lib/rental-search";
import { toast } from "@/lib/toast";
import { useSubmitLock } from "@/lib/use-submit-lock";
import { getVehicleCategoryLabel } from "@/lib/vehicle-catalog";
import { useCreateReservationMutation, useVehicleScheduleQuery } from "@/lib/query/hooks";
import {
  isCalendarDayBlocked,
  rentalRangeOverlapsBlocked,
  todayYmd,
} from "@/lib/vehicle-schedule";
import type { ApiValidationError, Location, Vehicle } from "@/types/api";
import type { Locale } from "@/i18n/config";

function applyApiValidationErrors(
  body: ApiValidationError,
  billing: ReturnType<typeof useForm<BillingData>>,
  rental: ReturnType<typeof useForm<RentalData>>,
) {
  const fieldMap: Record<string, { form: "billing" | "rental"; field: string }> = {
    "customer.full_name": { form: "billing", field: "name" },
    "customer.phone": { form: "billing", field: "phone" },
    "customer.email": { form: "billing", field: "email" },
    pickup_location_id: { form: "rental", field: "pickupCity" },
    dropoff_location_id: { form: "rental", field: "dropoffCity" },
    start_datetime: { form: "rental", field: "pickupDate" },
    end_datetime: { form: "rental", field: "dropoffDate" },
  };

  for (const [key, messages] of Object.entries(body.errors)) {
    const message = messages[0];
    if (!message) continue;

    const mapping = fieldMap[key];
    if (mapping?.form === "billing") {
      billing.setError(mapping.field as keyof BillingData, { type: "server", message });
    } else if (mapping?.form === "rental") {
      rental.setError(mapping.field as keyof RentalData, { type: "server", message });
    }
  }
}

function FormErrorBanner({ message }: { message: string }) {
  return (
    <div className="animate-fade-in-down flex items-start gap-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 animate-fade-in-down text-xs text-red-500">{msg}</p>;
}

function SectionCard({
  step,
  title,
  subtitle,
  done,
  children,
}: {
  step: string;
  title: string;
  subtitle: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in-up flex flex-col gap-5 rounded-[10px] border border-transparent bg-white p-6 dark:bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {done ? <CheckCircle2 size={18} className="text-green-500" /> : null}
          <span className="text-xs text-gray-400">{step}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function InputField({
  label,
  placeholder,
  error,
  registration,
  type = "text",
}: {
  label: string;
  placeholder: string;
  error?: string;
  registration: object;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full rounded-[8px] border bg-[#F6F7F9] px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-300 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-[#3563E9]"
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

function LocationSelect({
  label,
  placeholder,
  error,
  registration,
  locations,
}: {
  label: string;
  placeholder: string;
  error?: string;
  registration: object;
  locations: Location[];
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-[8px] border bg-[#F6F7F9] px-4 py-3 transition-colors ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      >
        <select
          id={id}
          {...registration}
          className="flex-1 bg-transparent text-sm text-gray-500 outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {locations.map((location) => (
            <option key={location.id} value={String(location.id)}>
              {location.name}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="shrink-0 text-gray-400" />
      </div>
      <FieldError msg={error} />
    </div>
  );
}

function DateTimeField({
  label,
  placeholder,
  error,
  registration,
  inputType,
}: {
  label: string;
  placeholder: string;
  error?: string;
  registration: object;
  inputType: "date" | "time";
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={inputType}
        placeholder={placeholder}
        {...registration}
        className={`w-full rounded-[8px] border bg-[#F6F7F9] px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-300 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-[#3563E9]"
        }`}
      />
      <FieldError msg={error} />
    </div>
  );
}

type CheckoutFormProps = {
  vehicle: Vehicle;
  locations: Location[];
};

export default function CheckoutForm({ vehicle, locations }: CheckoutFormProps) {
  const t = useTranslations("checkout");
  const catalogT = useTranslations("catalog");
  const locale = useLocale() as Locale;
  const billingSchema = useMemo(() => createBillingSchema(t), [t]);
  const rentalSchema = useMemo(() => createRentalSchema(t), [t]);
  const confirmSchema = useMemo(() => createConfirmSchema(t), [t]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageUrl = getVehicleImageUrl(vehicle);
  const categoryLabel = getVehicleCategoryLabel(vehicle);

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createReservationMutation = useCreateReservationMutation();
  const { data: schedule } = useVehicleScheduleQuery(vehicle.id);
  const blockedPeriods = schedule?.blocked_periods ?? [];
  const { runOnce, busy: submitBusy } = useSubmitLock();
  const submitting = submitBusy || createReservationMutation.isPending;

  const billing = useForm<BillingData>({
    resolver: zodResolver(billingSchema),
    mode: "onTouched",
  });
  const rental = useForm<RentalData>({
    resolver: zodResolver(rentalSchema),
    mode: "onTouched",
  });
  const confirm = useForm<ConfirmData>({
    resolver: zodResolver(confirmSchema),
    mode: "onTouched",
    defaultValues: { agreeTerms: false },
  });

  useEffect(() => {
    const rentalParams = rentalSearchFromQuery(searchParams);
    const firstLocationId = locations[0] ? String(locations[0].id) : "";

    rental.reset({
      pickupCity: rentalParams.pickupLocationId || firstLocationId,
      dropoffCity: rentalParams.dropoffLocationId || rentalParams.pickupLocationId || firstLocationId,
      pickupDate: rentalParams.pickupDate || "",
      pickupTime: rentalParams.pickupTime || "",
      dropoffDate: rentalParams.dropoffDate || "",
      dropoffTime: rentalParams.dropoffTime || "",
    });
  }, [locations, rental, searchParams]);

  const pickupDate = rental.watch("pickupDate") ?? "";
  const pickupTime = rental.watch("pickupTime") ?? "";
  const dropoffDate = rental.watch("dropoffDate") ?? "";
  const dropoffTime = rental.watch("dropoffTime") ?? "";
  const pickupCity = rental.watch("pickupCity") ?? "";
  const dropoffCity = rental.watch("dropoffCity") ?? "";
  const rentalPeriodValid = isRentalPeriodValid(pickupDate, pickupTime, dropoffDate, dropoffTime);
  const rentalPeriodBlocked =
    rentalPeriodValid &&
    rentalRangeOverlapsBlocked(
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      blockedPeriods,
    );
  const days = rentalPeriodValid && !rentalPeriodBlocked
    ? calculateRentalDays(pickupDate, pickupTime, dropoffDate, dropoffTime)
    : 0;
  const meetsMinRentalDays = days >= MIN_RENTAL_DAYS;
  const pickupLocation = locations.find((location) => String(location.id) === pickupCity);
  const dropoffLocation = locations.find((location) => String(location.id) === dropoffCity);
  const pricePerDay = pricePerDayForRental(vehicle, meetsMinRentalDays ? days : MIN_RENTAL_DAYS);
  const pricing = estimateRentalTotal(
    vehicle,
    meetsMinRentalDays ? days : MIN_RENTAL_DAYS,
    pickupLocation,
    dropoffLocation,
  );

  async function handleSubmit() {
    setSubmitError(null);

    const [billingOk, rentalOk, confirmOk] = await Promise.all([
      billing.trigger(),
      rental.trigger(),
      confirm.trigger(),
    ]);

    if (!billingOk) {
      const parsed = billingSchema.safeParse(billing.getValues());
      const message = parsed.success
        ? t("validationNameMin")
        : parsed.error.issues[0]?.message ?? t("validationNameMin");
      setSubmitError(message);
      toast.error(message);
      document.getElementById("checkout-billing")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!rentalOk) {
      const parsed = rentalSchema.safeParse(rental.getValues());
      const message = parsed.success
        ? t("validationPickupDate")
        : parsed.error.issues[0]?.message ?? t("validationPickupDate");
      setSubmitError(message);
      toast.error(message);
      document.getElementById("checkout-rental")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const rentalData = rental.getValues();
    if (
      isCalendarDayBlocked(rentalData.pickupDate, blockedPeriods) ||
      rentalRangeOverlapsBlocked(
        rentalData.pickupDate,
        rentalData.pickupTime,
        rentalData.dropoffDate,
        rentalData.dropoffTime,
        blockedPeriods,
      )
    ) {
      const message = t("blockedDatesHint");
      setSubmitError(message);
      toast.error(message);
      document.getElementById("checkout-rental")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (!confirmOk) {
      const message =
        confirm.formState.errors.agreeTerms?.message ??
        t("validationAgreeTerms");
      setSubmitError(message);
      toast.error(message);
      document.getElementById("checkout-confirm")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const billingData = billing.getValues();
    const startDatetime = combineDatetime(rentalData.pickupDate, rentalData.pickupTime);
    const endDatetime = combineDatetime(rentalData.dropoffDate, rentalData.dropoffTime);

    await runOnce(async () => {
      try {
        const availability = await checkVehicleAvailability(
          vehicle.id,
          startDatetime,
          endDatetime,
        );

        if (!availability.available) {
          const message = t("blockedDatesHint");
          setSubmitError(message);
          toast.error(message);
          document.getElementById("checkout-rental")?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        const response = await createReservationMutation.mutateAsync({
          customer: {
            full_name: billingData.name,
            nationality: PENDING_CUSTOMER_NATIONALITY,
            phone: billingData.phone,
            email: billingData.email,
          },
          vehicle_id: vehicle.id,
          pickup_location_id: Number(rentalData.pickupCity),
          dropoff_location_id: Number(rentalData.dropoffCity),
          start_datetime: startDatetime,
          end_datetime: endDatetime,
        });

        if (!response) {
          return;
        }

        const reservation = response.data;
        const params = new URLSearchParams({
          reservation_number: reservation.reservation_number,
          vehicle_name: reservation.vehicle?.name ?? vehicle.name,
          start_datetime: reservation.start_datetime,
          end_datetime: reservation.end_datetime,
          total_price: String(reservation.total_price),
          total_days: String(reservation.total_days),
          customer_name: reservation.customer?.full_name ?? billingData.name,
          phone: reservation.customer?.phone ?? billingData.phone,
          email: reservation.customer?.email ?? billingData.email,
        });
        router.push(`${routes.bookSuccess}?${params.toString()}`);
      } catch (error) {
        const validationBody = error instanceof ApiError ? error.body : error;

        if (isValidationError(validationBody)) {
          applyApiValidationErrors(validationBody, billing, rental);
          const messages = Object.values(validationBody.errors).flat();
          const message = messages[0] ?? validationBody.message ?? "Please correct the highlighted fields.";
          setSubmitError(message);
          toast.error(message, { duration: 5000 });

          if (validationBody.errors.end_datetime || validationBody.errors.start_datetime) {
            document.getElementById("checkout-rental")?.scrollIntoView({ behavior: "smooth", block: "start" });
          } else if (Object.keys(validationBody.errors).some((key) => key.startsWith("customer."))) {
            document.getElementById("checkout-billing")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          const message = error instanceof ApiError ? error.message : t("submitError");
          setSubmitError(message);
          toast.error(message);
        }
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {submitError ? <FormErrorBanner message={submitError} /> : null}

        <div id="checkout-billing">
        <SectionCard
          step={t("step1")}
          title={t("billingInfo")}
          subtitle=""
          done={step1Done}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label={t("name")}
              placeholder={t("name")}
              error={billing.formState.errors.name?.message}
              registration={billing.register("name")}
            />
            <InputField
              label={t("phone")}
              placeholder={t("phone")}
              error={billing.formState.errors.phone?.message}
              registration={billing.register("phone")}
            />
            <InputField
              label={t("email")}
              placeholder={t("email")}
              type="email"
              error={billing.formState.errors.email?.message}
              registration={billing.register("email")}
            />
          </div>
        </SectionCard>
        </div>

        <div id="checkout-rental">
        <SectionCard
          step={t("step2")}
          title={t("rentalInfo")}
          subtitle=""
          done={step2Done}
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full border-4 border-[#3563E9] bg-[#3563E9]" />
                <span className="text-sm font-semibold text-gray-900">
                  {t("pickup")}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LocationSelect
                  label={t("location")}
                  placeholder={t("selectLocation")}
                  error={rental.formState.errors.pickupCity?.message}
                  registration={rental.register("pickupCity")}
                  locations={locations}
                />
                <Controller
                  control={rental.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <RentalDateField
                      label={t("date")}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      blockedPeriods={blockedPeriods}
                      minDate={todayYmd()}
                      error={rental.formState.errors.pickupDate?.message}
                      name={field.name}
                    />
                  )}
                />
              </div>
              <DateTimeField
                label={t("time")}
                placeholder="HH:MM"
                error={rental.formState.errors.pickupTime?.message}
                registration={rental.register("pickupTime")}
                inputType="time"
              />
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full border-4 border-[#54A6D4] bg-[#54A6D4]" />
                <span className="text-sm font-semibold text-gray-900">
                  {t("dropoff")}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LocationSelect
                  label={t("location")}
                  placeholder={t("selectLocation")}
                  error={rental.formState.errors.dropoffCity?.message}
                  registration={rental.register("dropoffCity")}
                  locations={locations}
                />
                <Controller
                  control={rental.control}
                  name="dropoffDate"
                  render={({ field }) => (
                    <RentalDateField
                      label={t("date")}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={() => {
                        field.onBlur();
                        rental.trigger().then((valid) => setStep2Done(valid));
                      }}
                      minDate={pickupDate || todayYmd()}
                      error={rental.formState.errors.dropoffDate?.message}
                      name={field.name}
                    />
                  )}
                />
              </div>
              <DateTimeField
                label={t("time")}
                placeholder="HH:MM"
                error={rental.formState.errors.dropoffTime?.message}
                registration={rental.register("dropoffTime", {
                  onBlur: () => rental.trigger().then((valid) => setStep2Done(valid)),
                })}
                inputType="time"
              />
            </div>

            {!rentalPeriodValid && pickupDate && dropoffDate && pickupTime && dropoffTime ? (
              <p className="flex items-start gap-2 text-xs font-medium text-red-500">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {t("dropoffBeforePickup")}
              </p>
            ) : null}

            {rentalPeriodValid && rentalPeriodBlocked ? (
              <p className="flex items-start gap-2 text-xs font-medium text-red-500">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {t("overlapError")}
              </p>
            ) : null}

            {rentalPeriodValid && days > 0 && !meetsMinRentalDays ? (
              <p className="flex items-start gap-2 text-xs font-medium text-red-500">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {t("validationMinRentalDays")}
              </p>
            ) : null}

            {rentalPeriodValid && meetsMinRentalDays ? (
              <p className="text-xs font-semibold text-[#3563E9]">
                {days} {days > 1 ? t("days") : t("day")} × {formatCurrency(pricePerDay, locale)}{catalogT("perDay")} = {formatCurrency(pricing.rentalSubtotal, locale)}
              </p>
            ) : null}
          </div>
        </SectionCard>
        </div>

        <div id="checkout-confirm">
        <SectionCard
          step={t("step3")}
          title={t("confirmation")}
          subtitle=""
        >
          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-[8px] bg-[#F6F7F9] px-4 py-3.5">
              <input
                type="checkbox"
                {...confirm.register("agreeTerms")}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#3563E9]"
              />
              <span className="text-sm text-gray-600">
                {t("termsPrefix")}{" "}
                <Link
                  href={routes.terms}
                  target="_blank"
                  className="font-medium text-[#3563E9] hover:underline"
                >
                  {t("termsLink")}
                </Link>{" "}
                {t("termsSuffix")}
              </span>
            </label>
            <FieldError msg={confirm.formState.errors.agreeTerms?.message} />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !meetsMinRentalDays || rentalPeriodBlocked || !rentalPeriodValid}
              className="mt-2 w-fit rounded-[4px] bg-[#3563E9] px-8 py-3.5 font-semibold text-white transition-all hover:bg-[#2a52c9] active:scale-[0.97] disabled:opacity-50"
            >
              {submitting ? t("submitting") : t("rentNow")}
            </button>
            <div className="mt-2 flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {t("dataSafe")}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {t("dataSafeDesc")}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-6 rounded-[10px] border border-transparent bg-white p-6 dark:bg-white lg:sticky lg:top-6 lg:w-[340px]">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {t("rentalSummary")}
          </h2>
        </div>

        <div className="relative h-[200px] w-full overflow-hidden rounded-[10px] bg-gray-50">
          {imageUrl ? (
            <StorageImage
              src={imageUrl}
              alt={vehicle.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              {t("noImage")}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900">
            {vehicle.name}
          </h3>
          <p className="text-xs text-gray-400">{categoryLabel}</p>
        </div>

        <div className="border-t border-gray-100" />

        <div className="flex flex-col gap-3 text-sm">
          {!rentalPeriodValid && pickupDate && dropoffDate ? (
            <p className="rounded-[8px] bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {t("dropoffBeforePickup")}
            </p>
          ) : null}
          {rentalPeriodValid && rentalPeriodBlocked ? (
            <p className="rounded-[8px] bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {t("blockedDatesHint")}
            </p>
          ) : null}
          {rentalPeriodValid && days > 0 && !meetsMinRentalDays ? (
            <p className="rounded-[8px] bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {t("validationMinRentalDays")}
            </p>
          ) : null}
          {meetsMinRentalDays ? (
          <div className="flex justify-between">
            <span className="text-gray-400">
              {days} {days > 1 ? t("days") : t("day")} × {formatCurrency(pricePerDay, locale)}{catalogT("perDay")}
            </span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(pricing.rentalSubtotal, locale)}
            </span>
          </div>
          ) : null}
          {pricing.deliveryFee > 0 ? (
            <div className="flex justify-between">
              <span className="text-gray-400">{t("deliveryFees")}</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(pricing.deliveryFee, locale)}
              </span>
            </div>
          ) : null}
          {pricing.depositAmount > 0 ? (
            <div className="flex justify-between">
              <span className="text-gray-400">{t("deposit")}</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(pricing.depositAmount, locale)}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900">{t("estimatedTotal")}</p>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(pricing.estimatedTotal, locale)}
          </span>
        </div>
      </div>
    </div>
  );
}
