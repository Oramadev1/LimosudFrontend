export const INPUT_LIMITS = {
  name: 255,
  email: 255,
  phone: 20,
  message: 5000,
  notes: 2000,
  password: 128,
} as const;

export const PHONE_PATTERN = /^\+?[\d\s\-]{7,20}$/;

export const PERSON_NAME_PATTERN = /^[\p{L}\s'\-.]+$/u;
