export const MIN_RENTAL_DAYS = 3;

function rentalDatetime(date: string, time: string): Date | null {
  if (!date || !time) {
    return null;
  }

  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  const parsed = new Date(`${date}T${normalizedTime}`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function calculateRentalDays(
  pickupDate: string,
  pickupTime: string,
  dropoffDate: string,
  dropoffTime: string,
): number {
  const pickup = rentalDatetime(pickupDate, pickupTime);
  const dropoff = rentalDatetime(dropoffDate, dropoffTime);

  if (!pickup || !dropoff || dropoff <= pickup) {
    return 0;
  }

  return Math.max(1, Math.ceil((dropoff.getTime() - pickup.getTime()) / 86_400_000));
}

export function meetsMinimumRentalDays(
  pickupDate: string,
  pickupTime: string,
  dropoffDate: string,
  dropoffTime: string,
): boolean {
  return calculateRentalDays(pickupDate, pickupTime, dropoffDate, dropoffTime) >= MIN_RENTAL_DAYS;
}
