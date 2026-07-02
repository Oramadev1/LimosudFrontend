"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  buildMonthGrid,
  isCalendarDayBlocked,
  todayYmd,
  toDateYmd,
  type BlockedPeriod,
} from "@/lib/vehicle-schedule";

const CALENDAR_HEIGHT = 340;

type RentalDateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  blockedPeriods?: BlockedPeriod[];
  minDate?: string;
  error?: string;
  name?: string;
};

type CalendarPlacement = "bottom" | "top";

function isBeforeMin(dateYmd: string, minDate: string): boolean {
  return dateYmd < minDate;
}

export function RentalDateField({
  label,
  value,
  onChange,
  onBlur,
  blockedPeriods = [],
  minDate = todayYmd(),
  error,
  name,
}: RentalDateFieldProps) {
  const t = useTranslations("checkout");
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<CalendarPlacement>("bottom");
  const [panelStyle, setPanelStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    if (value) {
      const [year, month] = value.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }

    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const monthCells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  function updatePanelPosition() {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const nextPlacement =
      spaceBelow < CALENDAR_HEIGHT && spaceAbove > spaceBelow ? "top" : "bottom";

    setPlacement(nextPlacement);
    setPanelStyle({
      left: rect.left,
      width: Math.max(rect.width, 280),
      top:
        nextPlacement === "bottom"
          ? rect.bottom + 8
          : Math.max(8, rect.top - CALENDAR_HEIGHT - 8),
    });
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    updatePanelPosition();

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) {
        return;
      }

      const panel = document.getElementById(`rental-date-panel-${name ?? label}`);
      if (panel?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    function handleReposition() {
      updatePanelPosition();
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [label, name, open, viewMonth]);

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

  function toggleOpen() {
    setOpen((current) => {
      const next = !current;
      if (next) {
        requestAnimationFrame(updatePanelPosition);
      }
      return next;
    });
  }

  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const panelId = `rental-date-panel-${name ?? label}`;

  const calendarPanel =
    open && panelStyle ? (
      <div
        id={panelId}
        style={{
          position: "fixed",
          top: panelStyle.top,
          left: panelStyle.left,
          width: panelStyle.width,
          zIndex: 9999,
        }}
        className={`rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:bg-white ${
          placement === "top" ? "origin-bottom" : "origin-top"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setViewMonth(
                (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
            aria-label={t("prevMonth")}
          >
            <ChevronLeft size={16} />
          </button>
          <p className="text-sm font-semibold text-gray-800">{monthLabel}</p>
          <button
            type="button"
            onClick={() =>
              setViewMonth(
                (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
            aria-label={t("nextMonth")}
          >
            <ChevronRight size={16} />
          </button>
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
                    ? "cursor-not-allowed text-gray-300 line-through"
                    : selected
                      ? "bg-[#3563E9] font-semibold text-white"
                      : "text-gray-700 hover:bg-[#3563E9]/10"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] text-gray-400">{t("bookedDatesHint")}</p>
      </div>
    ) : null;

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        name={name}
        onClick={toggleOpen}
        onBlur={onBlur}
        className={`flex w-full items-center justify-between rounded-[8px] border bg-[#F6F7F9] px-4 py-3 text-left text-sm outline-none transition-colors ${
          error
            ? "border-red-400 text-red-700"
            : "border-gray-200 text-gray-700 focus:border-[#3563E9]"
        }`}
      >
        <span>{value || t("datePlaceholder")}</span>
        <Calendar size={16} className="text-gray-400" aria-hidden="true" />
      </button>

      {typeof document !== "undefined" && calendarPanel
        ? createPortal(calendarPanel, document.body)
        : null}

      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
