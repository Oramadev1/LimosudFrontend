import { z } from "zod";

import {
  INPUT_LIMITS,
  PERSON_NAME_PATTERN,
  PHONE_PATTERN,
} from "@/lib/input-limits";

type ContactTranslator = (key: string) => string;

export function createContactSchema(t: ContactTranslator) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t("validationNameMin"))
      .max(INPUT_LIMITS.name, t("validationNameMax"))
      .regex(PERSON_NAME_PATTERN, t("validationNameInvalid")),
    email: z
      .string()
      .trim()
      .min(1, t("validationEmailRequired"))
      .max(INPUT_LIMITS.email, t("validationEmailMax"))
      .email(t("validationEmailInvalid")),
    phone: z
      .string()
      .trim()
      .max(INPUT_LIMITS.phone, t("validationPhoneMax"))
      .refine(
        (value) => value === "" || PHONE_PATTERN.test(value),
        t("validationPhoneInvalid"),
      ),
    message: z
      .string()
      .trim()
      .min(10, t("validationMessageMin"))
      .max(INPUT_LIMITS.message, t("validationMessageMax")),
  });
}

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;
