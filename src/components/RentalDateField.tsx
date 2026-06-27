"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import {
  buildMonthGrid,
  isCalendarDayBlocked,
  todayYmd,
  toDateYmd,
  type BlockedPeriod,
} from "@/lib/vehicle-schedule";

const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type RentalDateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  blockedPeriods: BlockedPeriod[];
  minDate?: string;
  error?: string;
  name?: string;
};

function isBeforeMin(dateYmd: string, minDate: string): boolean {
  return dateYmd < minDate;
}

export function RentalDateField({
  label,
  value,
  onChange,
  onBlur,
  blockedPeriods,
  minDate = todayYmd(),
  error,
  name,
}: RentalDateFieldProps) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      const [year, month] = value.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }

    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const monthCells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  function isDisabled(date: Date): boolean {
    const dateYmd = toDateYmd(date);
    return isBeforeMin(dateYmd, minDate) || isCalendarDayBlocked(dateYmd, blockedPeriods);
  }

  function selectDate(date: Date) {
    const dateYmd = toDateYmd(date);
    if (isDisabled(date)) {
      return;
    }

    onChange(dateYmd);
    setOpen(false);
    onBlur?.();
  }

  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        name={name}
        onClick={() => setOpen((current) => !current)}
        onBlur={onBlur}
        className={`flex w-full items-center justify-between rounded-[8px] border bg-[#F6F7F9] px-4 py-3 text-left text-sm outline-none transition-colors dark:bg-gray-800 ${
          error
            ? "border-red-400 text-red-700"
            : "border-gray-200 text-gray-700 focus:border-[#3563E9] dark:border-gray-700 dark:text-gray-200"
        }`}
      >
        <span>{value || "YYYY-MM-DD"}</span>
        <Calendar size={16} className="text-gray-400" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute z-20 mt-2 w-full min-w-[280px] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setViewMonth(
                  (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                )
              }
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{monthLabel}</p>
            <button
              type="button"
              onClick={() =>
                setViewMonth(
                  (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                )
              }
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-gray-400">
            {weekdayLabels.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {monthCells.map((date, index) => {
              if (!date) {
                return <span key={`empty-${index}`} />;
              }

              const dateYmd = toDateYmd(date);
              const disabled = isDisabled(date);
              const selected = value === dateYmd;

              return (
                <button
                  key={dateYmd}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDate(date)}
                  className={`h-8 rounded-md text-sm transition ${
                    disabled
                      ? "cursor-not-allowed text-gray-300 line-through dark:text-gray-600"
                      : selected
                        ? "bg-[#3563E9] font-semibold text-white"
                        : "text-gray-700 hover:bg-[#3563E9]/10 dark:text-gray-200"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-[11px] text-gray-400">
            Crossed-out dates are already booked.
          </p>
        </div>
      ) : null}

      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
