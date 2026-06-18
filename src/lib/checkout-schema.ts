import { z } from "zod";

export const billingSchema = z.object({
  name:        z.string().min(2, "Name must be at least 2 characters"),
  phone:       z.string().regex(/^\+?[\d\s\-]{7,15}$/, "Enter a valid phone number"),
  address:     z.string().min(5, "Address must be at least 5 characters"),
  city:        z.string().min(2, "City must be at least 2 characters"),
  nationality: z.string().min(2, "Nationality is required"),
  email:       z.string().email("Enter a valid email").optional().or(z.literal("")),
});

export const rentalSchema = z.object({
  pickupCity:     z.string().min(1, "Select pickup city"),
  pickupDate:     z.string().min(1, "Select pickup date"),
  pickupTime:     z.string().min(1, "Select pickup time"),
  dropoffCity:    z.string().min(1, "Select dropoff city"),
  dropoffDate:    z.string().min(1, "Select dropoff date"),
  dropoffTime:    z.string().min(1, "Select dropoff time"),
});

export const confirmSchema = z.object({
  agreeMarketing: z.boolean(),
  agreeTerms:     z.boolean().refine((v) => v, "You must agree to terms"),
});

export type BillingData  = z.infer<typeof billingSchema>;
export type RentalData   = z.infer<typeof rentalSchema>;
export type ConfirmData  = z.infer<typeof confirmSchema>;
