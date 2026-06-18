"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, ChevronDown, CheckCircle2 } from "lucide-react";

import StorageImage from "@/components/StorageImage";

import { ApiError, isValidationError } from "@/lib/api/client";
import { checkVehicleAvailability } from "@/lib/api/public";
import {
  billingSchema,
  rentalSchema,
  confirmSchema,
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
import { toast } from "@/lib/toast";
import {
  getVehicleCategoryLabel,
  getVehicleDailyPrice,
} from "@/lib/vehicle-catalog";
import { useCreateReservationMutation } from "@/lib/query/hooks";
import type { Location, Vehicle } from "@/types/api";

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
  const dailyPrice = getVehicleDailyPrice(vehicle);
  const imageUrl = getVehicleImageUrl(vehicle);
  const categoryLabel = getVehicleCategoryLabel(vehicle);

  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const createReservationMutation = useCreateReservationMutation();
  const submitting = createReservationMutation.isPending;

  const billing = useForm<BillingData>({
    resolver: zodResolver(billingSchema),
    mode: "onBlur",
  });
  const rental = useForm<RentalData>({
    resolver: zodResolver(rentalSchema),
    mode: "onBlur",
  });
  const confirm = useForm<ConfirmData>({
    resolver: zodResolver(confirmSchema),
    mode: "onBlur",
  });

  const pickupDate = rental.watch("pickupDate") ?? "";
  const dropoffDate = rental.watch("dropoffDate") ?? "";
  const days = daysBetween(pickupDate, dropoffDate);
  const subtotal = dailyPrice * days;

  async function handleSubmit() {
    const [billingOk, rentalOk, confirmOk] = await Promise.all([
      billing.trigger(),
      rental.trigger(),
      confirm.trigger(),
    ]);

    if (!billingOk) {
      toast.error("Fill in Billing Info correctly");
      return;
    }
    if (!rentalOk) {
      toast.error("Fill in Rental Info correctly");
      return;
    }
    if (!confirmOk) {
      toast.error("Please agree to the terms");
      return;
    }

    const billingData = billing.getValues();
    const rentalData = rental.getValues();
    const startDatetime = combineDatetime(rentalData.pickupDate, rentalData.pickupTime);
    const endDatetime = combineDatetime(rentalData.dropoffDate, rentalData.dropoffTime);

    try {
      const availability = await checkVehicleAvailability(
        vehicle.id,
        startDatetime,
        endDatetime,
      );

      if (!availability.available) {
        toast.error("Vehicle is not available for the selected period.");
        return;
      }

      const response = await createReservationMutation.mutateAsync({
        customer: {
          full_name: billingData.name,
          nationality: billingData.nationality,
          phone: billingData.phone,
          email: billingData.email || undefined,
        },
        vehicle_id: vehicle.id,
        pickup_location_id: Number(rentalData.pickupCity),
        dropoff_location_id: Number(rentalData.dropoffCity),
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        customer_notes: billingData.address
          ? `Address: ${billingData.address}, ${billingData.city}`
          : undefined,
      });

      toast.success(
        `Reservation ${response.data.reservation_number} submitted — ${formatCurrency(response.data.total_price)}`,
        { duration: 5000 },
      );
      router.push(`/cars/${vehicle.slug}`);
    } catch (error) {
      const validationBody = error instanceof ApiError ? error.body : error;

      if (isValidationError(validationBody)) {
        toast.error("Please correct the validation errors.");
      } else {
        toast.error("Request failed. Please retry.");
      }
    }
  }

  return (
    <div className="flex flex-col items-start gap-6 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <SectionCard
          step="Step 1 of 3"
          title="Billing Info"
          subtitle="Please enter your billing info"
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
            <InputField
              label="Address"
              placeholder="Address"
              error={billing.formState.errors.address?.message}
              registration={billing.register("address")}
            />
            <InputField
              label="Town / City"
              placeholder="Town or city"
              error={billing.formState.errors.city?.message}
              registration={billing.register("city", {
                onBlur: () => billing.trigger().then((valid) => setStep1Done(valid)),
              })}
            />
            <InputField
              label="Nationality"
              placeholder="Your nationality"
              error={billing.formState.errors.nationality?.message}
              registration={billing.register("nationality")}
            />
            <InputField
              label="Email"
              placeholder="Email (optional)"
              type="email"
              error={billing.formState.errors.email?.message}
              registration={billing.register("email")}
            />
          </div>
        </SectionCard>

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

            {days > 1 ? (
              <p className="text-xs font-semibold text-[#3563E9]">
                {days} days × {formatCurrency(dailyPrice)}/day = {formatCurrency(subtotal)}
              </p>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard
          step="Step 3 of 3"
          title="Confirmation"
          subtitle="We are getting to the end. Just few clicks and your rental is ready!"
        >
          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-[8px] bg-[#F6F7F9] px-4 py-3.5 dark:bg-gray-800">
              <input
                type="checkbox"
                {...confirm.register("agreeMarketing")}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#3563E9]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                I agree with sending Marketing and newsletter emails. No spam, promised!
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-[8px] bg-[#F6F7F9] px-4 py-3.5 dark:bg-gray-800">
              <input
                type="checkbox"
                {...confirm.register("agreeTerms")}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#3563E9]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                I agree with our terms and conditions and privacy policy.
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

        <div className="flex items-center gap-4">
          <div className="relative h-[70px] w-[100px] shrink-0 overflow-hidden rounded-[8px] bg-gradient-to-br from-[#1C3FA8] to-[#3563E9]">
            {imageUrl ? (
              <StorageImage
                src={imageUrl}
                alt={vehicle.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-white/70">
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
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">
              {days} day{days > 1 ? "s" : ""} × {formatCurrency(dailyPrice)}/day
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Estimated Total</p>
            <p className="mt-0.5 text-xs text-gray-400">
              Final price is calculated when your reservation is submitted
            </p>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
