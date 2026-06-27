"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

import StorageImage from "@/components/StorageImage";

import { ApiError, isValidationError } from "@/lib/api/client";
import { checkVehicleAvailability } from "@/lib/api/public";
import {
  billingSchema,
  rentalSchema,
  confirmSchema,
  PENDING_CUSTOMER_NATIONALITY,
  isRentalPeriodValid,
  type BillingData,
  type RentalData,
  type ConfirmData,
} from "@/lib/checkout-schema";
import {
  combineDatetime,
  daysBetween,
  formatCurrency,
} from "@/lib/format";
import { getVehicleImageUrl } from "@/lib/images";
import { routes } from "@/config/routes";
import { estimateRentalTotal, pricePerDayForRental } from "@/lib/rental-pricing";
import { rentalSearchFromQuery } from "@/lib/rental-search";
import { toast } from "@/lib/toast";
import { useSubmitLock } from "@/lib/use-submit-lock";
import { getVehicleCategoryLabel } from "@/lib/vehicle-catalog";
import { useCreateReservationMutation } from "@/lib/query/hooks";
import type { ApiValidationError, Location, Vehicle } from "@/types/api";

function applyApiValidationErrors(
  body: ApiValidationError,
  billing: ReturnType<typeof useForm<BillingData>>,
  rental: ReturnType<typeof useForm<RentalData>>,
) {
  const fieldMap: Record<string, { form: "billing" | "rental"; field: string }> = {
    "customer.full_name": { form: "billing", field: "name" },
    "customer.phone": { form: "billing", field: "phone" },
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
    <div className="animate-fade-in-down flex items-start gap-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
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
    <div className="animate-fade-in-up flex flex-col gap-5 rounded-[10px] border border-transparent bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
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
        className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full rounded-[8px] border bg-[#F6F7F9] px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-600 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-[#3563E9] dark:border-gray-700"
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
        className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-[8px] border bg-[#F6F7F9] px-4 py-3 transition-colors dark:bg-gray-800 ${
          error ? "border-red-400" : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <select
          id={id}
          {...registration}
          className="flex-1 bg-transparent text-sm text-gray-500 outline-none dark:text-gray-300"
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
        className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={id}
        type={inputType}
        placeholder={placeholder}
        {...registration}
        className={`w-full rounded-[8px] border bg-[#F6F7F9] px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-600 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-[#3563E9] dark:border-gray-700"
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageUrl = getVehicleImageUrl(vehicle);
  const categoryLabel = getVehicleCategoryLabel(vehicle);

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createReservationMutation = useCreateReservationMutation();
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
  const days = rentalPeriodValid ? daysBetween(pickupDate, dropoffDate) : 0;
  const pickupLocation = locations.find((location) => String(location.id) === pickupCity);
  const dropoffLocation = locations.find((location) => String(location.id) === dropoffCity);
  const pricePerDay = pricePerDayForRental(vehicle, Math.max(days, 1));
  const pricing = estimateRentalTotal(vehicle, Math.max(days, 1), pickupLocation, dropoffLocation);

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
        ? "Please complete billing information."
        : parsed.error.issues[0]?.message ?? "Please complete billing information.";
      setSubmitError(message);
      toast.error(message);
      document.getElementById("checkout-billing")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!rentalOk) {
      const parsed = rentalSchema.safeParse(rental.getValues());
      const message = parsed.success
        ? "Please complete rental dates and locations."
        : parsed.error.issues[0]?.message ?? "Please complete rental dates and locations.";
      setSubmitError(message);
      toast.error(message);
      document.getElementById("checkout-rental")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!confirmOk) {
      const message =
        confirm.formState.errors.agreeTerms?.message ??
        "Please agree to the terms and conditions.";
      setSubmitError(message);
      toast.error(message);
      document.getElementById("checkout-confirm")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const billingData = billing.getValues();
    const rentalData = rental.getValues();
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
          const message = "This vehicle is not available for the selected dates. Please choose different dates.";
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

        toast.success(
          `Reservation ${response.data.reservation_number} submitted — ${formatCurrency(response.data.total_price)}`,
          { duration: 5000 },
        );
        router.push(routes.vehicle(vehicle.slug));
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
          const message = error instanceof ApiError ? error.message : "Request failed. Please try again.";
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
          step="Step 1 of 3"
          title="Billing Info"
          subtitle="Please enter your name and phone number"
          done={step1Done}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Name"
              placeholder="Your name"
              error={billing.formState.errors.name?.message}
              registration={billing.register("name")}
            />
            <InputField
              label="Phone Number"
              placeholder="Phone number"
              error={billing.formState.errors.phone?.message}
              registration={billing.register("phone")}
            />
          </div>
        </SectionCard>
        </div>

        <div id="checkout-rental">
        <SectionCard
          step="Step 2 of 3"
          title="Rental Info"
          subtitle="Please select your rental date"
          done={step2Done}
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full border-4 border-[#3563E9] bg-[#3563E9]" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Pick – Up
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LocationSelect
                  label="Location"
                  placeholder="Select location"
                  error={rental.formState.errors.pickupCity?.message}
                  registration={rental.register("pickupCity")}
                  locations={locations}
                />
                <DateTimeField
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  error={rental.formState.errors.pickupDate?.message}
                  registration={rental.register("pickupDate")}
                  inputType="date"
                />
              </div>
              <DateTimeField
                label="Time"
                placeholder="HH:MM"
                error={rental.formState.errors.pickupTime?.message}
                registration={rental.register("pickupTime")}
                inputType="time"
              />
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full border-4 border-[#54A6D4] bg-[#54A6D4]" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Drop – Off
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LocationSelect
                  label="Location"
                  placeholder="Select location"
                  error={rental.formState.errors.dropoffCity?.message}
                  registration={rental.register("dropoffCity")}
                  locations={locations}
                />
                <DateTimeField
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  error={rental.formState.errors.dropoffDate?.message}
                  registration={rental.register("dropoffDate")}
                  inputType="date"
                />
              </div>
              <DateTimeField
                label="Time"
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
                Drop-off must be after pick-up date and time.
              </p>
            ) : null}

            {rentalPeriodValid && days > 1 ? (
              <p className="text-xs font-semibold text-[#3563E9]">
                {days} days × {formatCurrency(pricePerDay)}/day = {formatCurrency(pricing.rentalSubtotal)}
              </p>
            ) : null}
          </div>
        </SectionCard>
        </div>

        <div id="checkout-confirm">
        <SectionCard
          step="Step 3 of 3"
          title="Confirmation"
          subtitle="We are getting to the end. Just few clicks and your rental is ready!"
        >
          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-[8px] bg-[#F6F7F9] px-4 py-3.5 dark:bg-gray-800">
              <input
                type="checkbox"
                {...confirm.register("agreeTerms")}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#3563E9]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                I agree with our{" "}
                <Link
                  href={routes.terms}
                  target="_blank"
                  className="font-medium text-[#3563E9] hover:underline"
                >
                  terms and conditions
                </Link>{" "}
                and cancellation policy.
              </span>
            </label>
            <FieldError msg={confirm.formState.errors.agreeTerms?.message} />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-2 w-fit rounded-[4px] bg-[#3563E9] px-8 py-3.5 font-semibold text-white transition-all hover:bg-[#2a52c9] active:scale-[0.97] disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Rent Now"}
            </button>
            <div className="mt-2 flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-gray-400" />
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  All your data are safe
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  We are using the most advanced security to provide you the best experience.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-6 rounded-[10px] border border-transparent bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-6 lg:w-[340px]">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Rental Summary
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Prices may change depending on the length of the rental and the price of your
            rental car.
          </p>
        </div>

        <div className="relative h-[200px] w-full overflow-hidden rounded-[10px] bg-gray-50 dark:bg-gray-900">
          {imageUrl ? (
            <StorageImage
              src={imageUrl}
              alt={vehicle.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {vehicle.name}
          </h3>
          <p className="text-xs text-gray-400">{categoryLabel}</p>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        <div className="flex flex-col gap-3 text-sm">
          {!rentalPeriodValid && pickupDate && dropoffDate ? (
            <p className="rounded-[8px] bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              Drop-off must be after pick-up before you can submit.
            </p>
          ) : null}
          <div className="flex justify-between">
            <span className="text-gray-400">
              {Math.max(days, 1)} day{days > 1 ? "s" : ""} × {formatCurrency(pricePerDay)}/day
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(pricing.rentalSubtotal)}
            </span>
          </div>
          {pricing.deliveryFee > 0 ? (
            <div className="flex justify-between">
              <span className="text-gray-400">Delivery fees</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(pricing.deliveryFee)}
              </span>
            </div>
          ) : null}
          {pricing.depositAmount > 0 ? (
            <div className="flex justify-between">
              <span className="text-gray-400">Deposit</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(pricing.depositAmount)}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Estimated Total</p>
            <p className="mt-0.5 text-xs text-gray-400">
              Includes rental, delivery, and deposit when locations are selected
            </p>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(pricing.estimatedTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
