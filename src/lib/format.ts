export function formatCurrency(amount: string | number): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function toApiDatetime(localDatetime: string): string {
  const date = new Date(localDatetime);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function combineDatetime(date: string, time: string): string {
  if (!date || !time) {
    return "";
  }

  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return toApiDatetime(`${date}T${normalizedTime}`);
}

export function daysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) {
    return 1;
  }

  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

export function toInputDatetime(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
