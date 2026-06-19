import { z } from "zod";

function rentalDatetime(date: string, time: string): Date | null {
  if (!date || !time) {
    return null;
  }

  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const parsed = new Date(`${date}T${normalizedTime}`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export const billingSchema = z.object({
  name:        z.string().min(2, "Name must be at least 2 characters"),
  phone:       z.string().min(1, "Phone number is required").regex(/^\+?[\d\s\-]{7,15}$/, "Enter a valid phone number"),
  address:     z.string().min(5, "Address must be at least 5 characters"),
  city:        z.string().min(2, "City must be at least 2 characters"),
  nationality: z.string().min(2, "Nationality is required"),
  email:       z.string().email("Enter a valid email").optional().or(z.literal("")),
});

export const rentalSchema = z
  .object({
    pickupCity:     z.string().min(1, "Select a pick-up location"),
    pickupDate:     z.string().min(1, "Select a pick-up date"),
    pickupTime:     z.string().min(1, "Select a pick-up time"),
    dropoffCity:    z.string().min(1, "Select a drop-off location"),
    dropoffDate:    z.string().min(1, "Select a drop-off date"),
    dropoffTime:    z.string().min(1, "Select a drop-off time"),
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
        message: "Drop-off must be after pick-up date and time",
        path: ["dropoffDate"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Drop-off time must be after pick-up",
        path: ["dropoffTime"],
      });
    }
  });

export const confirmSchema = z.object({
  agreeMarketing: z.boolean(),
  agreeTerms:     z.boolean().refine((v) => v, "You must agree to the terms and conditions"),
});

export type BillingData  = z.infer<typeof billingSchema>;
export type RentalData   = z.infer<typeof rentalSchema>;
export type ConfirmData  = z.infer<typeof confirmSchema>;

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
