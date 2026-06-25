import { formatCurrency } from "@/lib/format";
import {
  getVehicleCategoryLabel,
  getVehicleFuelLabel,
  getVehicleTransmissionLabel,
} from "@/lib/vehicle-catalog";
import { getVehicleImageUrl } from "@/lib/images";
import { pickPublicCarImage } from "@/lib/public-car-images";
import { routes } from "@/config/routes";
import type { MarketingCar } from "@/types/marketing";
import type { Vehicle } from "@/types/api";

export function vehicleToMarketingCar(
  vehicle: Vehicle,
  carImages: readonly string[],
  index = vehicle.id,
): MarketingCar {
  const apiImage = getVehicleImageUrl(vehicle);

  return {
    id: vehicle.id,
    name: vehicle.name,
    year: vehicle.year,
    image: apiImage ?? pickPublicCarImage(index, carImages),
    brand: vehicle.brand?.name,
    model: vehicle.model,
    category: getVehicleCategoryLabel(vehicle),
    seats: vehicle.seats,
    fuel: getVehicleFuelLabel(vehicle),
    transmission: getVehicleTransmissionLabel(vehicle),
    price: parseFloat(vehicle.daily_price),
    priceUnit: "/day",
    type: "rent",
    href: routes.vehicle(vehicle.slug),
    isFeatured: vehicle.is_featured,
  };
}

export function formatMarketingPrice(car: MarketingCar): string {
  return formatCurrency(car.price);
}
