import type { Location, Vehicle } from "@/types/api";

export function pricePerDayForRental(vehicle: Vehicle, _totalDays: number): number {
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
