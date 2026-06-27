export type BlockedPeriod = {
  start_datetime: string;
  end_datetime: string;
  status?: string | null;
  reservation_number?: string;
};

export type VehicleSchedule = {
  vehicle_id: number;
  vehicle_rentable: boolean;
  vehicle_status: string | null;
  blocked_periods: BlockedPeriod[];
};

function parseLocalDate(dateYmd: string): Date {
  const [year, month, day] = dateYmd.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateYmd(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayYmd(): string {
  return toDateYmd(new Date());
}

export function isCalendarDayBlocked(dateYmd: string, periods: BlockedPeriod[]): boolean {
  if (!dateYmd) {
    return false;
  }

  const day = parseLocalDate(dateYmd).getTime();

  return periods.some((period) => {
    const start = parseLocalDate(period.start_datetime.slice(0, 10)).getTime();
    const end = parseLocalDate(period.end_datetime.slice(0, 10)).getTime();
    return day >= start && day <= end;
  });
}

export function rentalRangeOverlapsBlocked(
  pickupDate: string,
  pickupTime: string,
  dropoffDate: string,
  dropoffTime: string,
  periods: BlockedPeriod[],
): boolean {
  if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
    return false;
  }

  const normalizeTime = (time: string) => (time.length === 5 ? `${time}:00` : time);
  const start = new Date(`${pickupDate}T${normalizeTime(pickupTime)}`).getTime();
  const end = new Date(`${dropoffDate}T${normalizeTime(dropoffTime)}`).getTime();

  return periods.some((period) => {
    const periodStart = new Date(period.start_datetime.replace(" ", "T")).getTime();
    const periodEnd = new Date(period.end_datetime.replace(" ", "T")).getTime();
    return start < periodEnd && end > periodStart;
  });
}

export function buildMonthGrid(viewMonth: Date): Array<Date | null> {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];

  for (let index = 0; index < startOffset; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
}
