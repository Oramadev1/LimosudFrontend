const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export function sanitizePlainText(value: string, maxLength: number): string {
  const withoutTags = value.replace(/<[^>]*>/g, "");
  const cleaned = withoutTags.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();

  return cleaned.slice(0, maxLength);
}

export function sanitizeMultilineText(value: string, maxLength: number): string {
  const withoutTags = value.replace(/<[^>]*>/g, "");
  const cleaned = withoutTags.replace(CONTROL_CHARS, "").trim();

  return cleaned.slice(0, maxLength);
}

export function sanitizeEmail(value: string, maxLength: number): string {
  return value.trim().toLowerCase().slice(0, maxLength);
}
