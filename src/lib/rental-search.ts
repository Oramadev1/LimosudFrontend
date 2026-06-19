import { routes } from "@/config/routes";

export type RentalSearchValues = {
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatInputDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function defaultRentalSearchValues(): RentalSearchValues {
  const pickup = new Date();
  pickup.setDate(pickup.getDate() + 1);
  pickup.setHours(10, 0, 0, 0);

  const dropoff = new Date(pickup);
  dropoff.setDate(dropoff.getDate() + 3);

  return {
    pickupLocationId: "",
    dropoffLocationId: "",
    pickupDate: formatInputDate(pickup),
    pickupTime: "10:00",
    dropoffDate: formatInputDate(dropoff),
    dropoffTime: "10:00",
  };
}

export function toDatetimeLocal(date: string, time: string): string {
  if (!date || !time) {
    return "";
  }

  return `${date}T${time.slice(0, 5)}`;
}

export function fromDatetimeLocal(value: string): { date: string; time: string } {
  if (!value) {
    return { date: "", time: "" };
  }

  const [date, time = "10:00"] = value.split("T");
  return { date, time: time.slice(0, 5) };
}

export function rentalSearchToQuery(values: RentalSearchValues): URLSearchParams {
  const params = new URLSearchParams();

  if (values.pickupLocationId) {
    params.set("pickup", values.pickupLocationId);
  }
  if (values.dropoffLocationId) {
    params.set("dropoff", values.dropoffLocationId);
  }

  const from = toDatetimeLocal(values.pickupDate, values.pickupTime);
  const to = toDatetimeLocal(values.dropoffDate, values.dropoffTime);

  if (from) {
    params.set("from", from);
  }
  if (to) {
    params.set("to", to);
  }

  return params;
}

export function rentalSearchFromQuery(searchParams: URLSearchParams): Partial<RentalSearchValues> {
  const values: Partial<RentalSearchValues> = {};

  const pickup =
    searchParams.get("pickup") ??
    searchParams.get("pickup_location");
  const dropoff =
    searchParams.get("dropoff") ??
    searchParams.get("dropoff_location");

  if (pickup) {
    values.pickupLocationId = pickup;
  }
  if (dropoff) {
    values.dropoffLocationId = dropoff;
  }

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (from) {
    const pickupDatetime = fromDatetimeLocal(from);
    values.pickupDate = pickupDatetime.date;
    values.pickupTime = pickupDatetime.time;
  } else {
    const pickupDate = searchParams.get("pickup_date");
    const pickupTime = searchParams.get("pickup_time");
    if (pickupDate) values.pickupDate = pickupDate;
    if (pickupTime) values.pickupTime = pickupTime;
  }

  if (to) {
    const dropoffDatetime = fromDatetimeLocal(to);
    values.dropoffDate = dropoffDatetime.date;
    values.dropoffTime = dropoffDatetime.time;
  } else {
    const dropoffDate = searchParams.get("dropoff_date");
    const dropoffTime = searchParams.get("dropoff_time");
    if (dropoffDate) values.dropoffDate = dropoffDate;
    if (dropoffTime) values.dropoffTime = dropoffTime;
  }

  return values;
}

export function buildVehiclesSearchUrl(values: RentalSearchValues): string {
  const query = rentalSearchToQuery(values).toString();
  return query ? `${routes.vehicles}?${query}` : routes.vehicles;
}

export function buildBookUrl(slug: string, values?: Partial<RentalSearchValues>): string {
  const query = rentalSearchToQuery({
    ...defaultRentalSearchValues(),
    ...values,
  }).toString();

  return routes.book(slug, query);
}

export function isRentalSearchComplete(values: RentalSearchValues): boolean {
  return Boolean(
    values.pickupLocationId &&
      values.dropoffLocationId &&
      values.pickupDate &&
      values.pickupTime &&
      values.dropoffDate &&
      values.dropoffTime,
  );
}

export function isRentalSearchPeriodValid(values: RentalSearchValues): boolean {
  const pickup = new Date(`${values.pickupDate}T${values.pickupTime}`);
  const dropoff = new Date(`${values.dropoffDate}T${values.dropoffTime}`);

  if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
    return true;
  }

  return dropoff > pickup;
}

/** @deprecated Use buildVehiclesSearchUrl */
export const buildCarsSearchUrl = buildVehiclesSearchUrl;

/** @deprecated Use buildBookUrl */
export const buildCheckoutUrl = buildBookUrl;
