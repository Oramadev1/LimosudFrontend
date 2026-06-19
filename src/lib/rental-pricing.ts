import type { Location, Vehicle } from "@/types/api";

export function pricePerDayForRental(vehicle: Vehicle, totalDays: number): number {
  if (totalDays >= 30 && parseFloat(vehicle.monthly_price) > 0) {
    return parseFloat(vehicle.monthly_price) / 30;
  }

  if (totalDays >= 7 && parseFloat(vehicle.weekly_price) > 0) {
    return parseFloat(vehicle.weekly_price) / 7;
  }

  return parseFloat(vehicle.daily_price);
}

export function estimateRentalTotal(
  vehicle: Vehicle,
  totalDays: number,
  pickupLocation?: Location | null,
  dropoffLocation?: Location | null,
): {
  rentalSubtotal: number;
  deliveryFee: number;
  depositAmount: number;
  estimatedTotal: number;
} {
  const pricePerDay = pricePerDayForRental(vehicle, totalDays);
  const rentalSubtotal = pricePerDay * totalDays;
  const deliveryFee =
    parseFloat(pickupLocation?.delivery_fee ?? "0") +
    parseFloat(dropoffLocation?.delivery_fee ?? "0");
  const depositAmount = parseFloat(vehicle.deposit_amount);
  const estimatedTotal = rentalSubtotal + deliveryFee + depositAmount;

  return {
    rentalSubtotal,
    deliveryFee,
    depositAmount,
    estimatedTotal,
  };
}
