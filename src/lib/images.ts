import { siteConfig } from "@/config/site";
import type { Vehicle, VehiclePhoto } from "@/types/api";

export function getStorageBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_ORIGIN;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  return siteConfig.apiUrl.replace(/\/api\/?$/, "");
}

export function vehiclePhotoUrl(path: string): string {
  return `${getStorageBaseUrl()}/storage/${path}`;
}

export function getPrimaryPhoto(vehicle: Vehicle): VehiclePhoto | null {
  if (!vehicle.photos?.length) {
    return null;
  }

  const sorted = [...vehicle.photos].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return sorted.find((photo) => photo.is_primary) ?? sorted[0];
}

export function getVehicleImageUrl(vehicle: Vehicle): string | null {
  const photo = getPrimaryPhoto(vehicle);
  return photo ? vehiclePhotoUrl(photo.path) : null;
}
