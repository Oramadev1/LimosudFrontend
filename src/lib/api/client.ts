import { siteConfig } from "@/config/site";
import type { ApiValidationError } from "@/types/api";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(
      typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as ApiValidationError).message === "string"
        ? (body as ApiValidationError).message
        : `API request failed with status ${status}`,
    );
    this.status = status;
    this.body = body;
  }
}

export function isValidationError(
  error: unknown,
): error is ApiValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    typeof (error as ApiValidationError).errors === "object"
  );
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${siteConfig.apiUrl}${path}`;

  const isDynamic = init?.cache === "no-store" || init?.method === "POST";
  const isBrowser = typeof window !== "undefined";

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    ...(isDynamic || isBrowser
      ? { cache: "no-store" as const }
      : { next: { revalidate: 60 } }),
  }).catch((error: unknown) => {
    if (error instanceof TypeError) {
      throw new ApiError(0, {
        message:
          "Unable to reach the API. Make sure the backend is running on http://127.0.0.1:8000.",
      });
    }

    throw error;
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}
