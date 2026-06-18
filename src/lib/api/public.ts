import { apiFetch } from "@/lib/api/client";
import type {
  CreateReservationPayload,
  Location,
  Paginated,
  PublicLookups,
  Reservation,
  Vehicle,
} from "@/types/api";

export function getLookups() {
  return apiFetch<PublicLookups>("/public/lookups");
}

export function getLocations() {
  return apiFetch<{ data: Location[] }>("/public/locations");
}

export function getVehicles(page = 1) {
  return apiFetch<Paginated<Vehicle>>(`/public/vehicles?page=${page}`);
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const firstPage = await getVehicles(1);
  const vehicles = [...firstPage.data];

  for (let page = 2; page <= firstPage.meta.last_page; page += 1) {
    const nextPage = await getVehicles(page);
    vehicles.push(...nextPage.data);
  }

  return vehicles;
}

export function getVehicle(slug: string) {
  return apiFetch<{ data: Vehicle }>(`/public/vehicles/${slug}`);
}

export function checkVehicleAvailability(
  vehicleId: number,
  startDatetime: string,
  endDatetime: string,
) {
  const params = new URLSearchParams({
    start_datetime: startDatetime,
    end_datetime: endDatetime,
  });

  return apiFetch<{ vehicle_id: number; available: boolean }>(
    `/public/vehicles/${vehicleId}/availability?${params}`,
    { cache: "no-store" },
  );
}

export function createReservation(body: CreateReservationPayload) {
  return apiFetch<{ data: Reservation }>("/public/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}
