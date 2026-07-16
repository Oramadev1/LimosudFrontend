import { z } from "zod";

import {
  INPUT_LIMITS,
  PERSON_NAME_PATTERN,
  PHONE_PATTERN,
} from "@/lib/input-limits";
import { MIN_RENTAL_DAYS, calculateRentalDays } from "@/lib/rental-rules";

function rentalDatetime(date: string, time: string): Date | null {
  if (!date || !time) {
    return null;
  }

  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const parsed = new Date(`${date}T${normalizedTime}`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export const PENDING_CUSTOMER_NATIONALITY = "Pending";

type CheckoutTranslator = (key: string) => string;

export function createBillingSchema(t: CheckoutTranslator) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t("validationNameMin"))
      .max(INPUT_LIMITS.name, t("validationNameMax"))
      .regex(PERSON_NAME_PATTERN, t("validationNameInvalid")),
    phone: z
      .string()
      .trim()
      .min(1, t("validationPhoneRequired"))
      .max(INPUT_LIMITS.phone, t("validationPhoneMax"))
      .regex(PHONE_PATTERN, t("validationPhoneInvalid")),
    email: z
      .string()
      .trim()
      .min(1, t("validationEmailRequired"))
      .max(INPUT_LIMITS.email, t("validationEmailMax"))
      .email(t("validationEmailInvalid")),
  });
}

export function createRentalSchema(t: CheckoutTranslator) {
  return z
    .object({
      pickupCity: z.string().min(1, t("validationPickupLocation")),
      pickupDate: z.string().min(1, t("validationPickupDate")),
      pickupTime: z.string().min(1, t("validationPickupTime")),
      dropoffCity: z.string().min(1, t("validationDropoffLocation")),
      dropoffDate: z.string().min(1, t("validationDropoffDate")),
      dropoffTime: z.string().min(1, t("validationDropoffTime")),
    })
    .superRefine((data, ctx) => {
      const pickup = rentalDatetime(data.pickupDate, data.pickupTime);
      const dropoff = rentalDatetime(data.dropoffDate, data.dropoffTime);

      if (!pickup || !dropoff) {
        return;
      }

      if (dropoff <= pickup) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("dropoffBeforePickup"),
          path: ["dropoffDate"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validationDropoffTimeAfter"),
          path: ["dropoffTime"],
        });
        return;
      }

      const days = calculateRentalDays(
        data.pickupDate,
        data.pickupTime,
        data.dropoffDate,
        data.dropoffTime,
      );

      if (days > 0 && days < MIN_RENTAL_DAYS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validationMinRentalDays"),
          path: ["dropoffDate"],
        });
      }
    });
}

export function createConfirmSchema(t: CheckoutTranslator) {
  return z.object({
    agreeTerms: z.boolean().refine((value) => value, t("validationAgreeTerms")),
  });
}

export type BillingData = z.infer<ReturnType<typeof createBillingSchema>>;
export type RentalData = z.infer<ReturnType<typeof createRentalSchema>>;
export type ConfirmData = z.infer<ReturnType<typeof createConfirmSchema>>;

export function isRentalPeriodValid(
  pickupDate: string,
  pickupTime: string,
  dropoffDate: string,
  dropoffTime: string,
): boolean {
  const pickup = rentalDatetime(pickupDate, pickupTime);
  const dropoff = rentalDatetime(dropoffDate, dropoffTime);

  if (!pickup || !dropoff) {
    return true;
  }

  return dropoff > pickup;
}
