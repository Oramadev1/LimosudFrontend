"use client";

import { useState } from "react";
import { ArrowLeftRight, ChevronDown, MapPin } from "lucide-react";

const cities = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta", "Multan", "Faisalabad", "Rawalpindi"];
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM",
];

interface SectionState { city: string; date: string; time: string }

type DropdownKey = "pu-city" | "pu-date" | "pu-time" | "do-city" | "do-date" | "do-time";

function PickDropSection({
  label, dotColor, prefix, state, onChange, openDropdown, setOpenDropdown,
}: {
  label: string;
  dotColor: string;
  prefix: "pu" | "do";
  state: SectionState;
  onChange: (next: SectionState) => void;
  openDropdown: DropdownKey | null;
  setOpenDropdown: (k: DropdownKey | null) => void;
}) {
  const key = (field: string) => `${prefix}-${field}` as DropdownKey;
  const isOpen = (field: string) => openDropdown === key(field);
  const toggle = (field: string) => setOpenDropdown(isOpen(field) ? null : key(field));

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4 flex-1 min-w-0 w-full">
      {/* Label */}
      <div className="flex items-center gap-2 shrink-0">
        <div className={`w-3.5 h-3.5 rounded-full border-4 ${dotColor}`} />
        <span className="font-semibold text-sm text-gray-900 dark:text-white whitespace-nowrap">{label}</span>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 min-w-0">

        {/* City */}
        <div className="relative col-span-2 sm:col-span-1">
          <button
            type="button"
            onClick={() => toggle("city")}
            className="w-full min-w-0 flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 hover:border-[#3563E9] transition-colors bg-white dark:bg-gray-800 overflow-hidden"
          >
            <MapPin size={14} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-400 dark:text-gray-400 flex-1 text-left truncate">
              {state.city || "Select your city"}
            </span>
            <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${isOpen("city") ? "rotate-180" : ""}`} />
          </button>
          {isOpen("city") && (
            <ul className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-30 overflow-hidden max-h-48 overflow-y-auto">
              {cities.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => { onChange({ ...state, city: c }); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ${state.city === c ? "text-[#3563E9] font-semibold" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggle("date")}
            className="w-full min-w-0 flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 hover:border-[#3563E9] transition-colors bg-white dark:bg-gray-800 overflow-hidden"
          >
            <span className="text-xs text-gray-400 flex-1 text-left truncate">
              {state.date || "Select your date"}
            </span>
            <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${isOpen("date") ? "rotate-180" : ""}`} />
          </button>
          {isOpen("date") && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-30 p-3">
              <input
                type="date"
                value={state.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => { onChange({ ...state, date: e.target.value }); setOpenDropdown(null); }}
                className="text-sm text-gray-700 dark:text-gray-200 bg-transparent outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          )}
        </div>

        {/* Time */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggle("time")}
            className="w-full min-w-0 flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-[4px] px-3 py-2 hover:border-[#3563E9] transition-colors bg-white dark:bg-gray-800 overflow-hidden"
          >
            <span className="text-xs text-gray-400 flex-1 text-left truncate">
              {state.time || "Select your time"}
            </span>
            <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${isOpen("time") ? "rotate-180" : ""}`} />
          </button>
          {isOpen("time") && (
            <ul className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg z-30 overflow-hidden max-h-48 overflow-y-auto">
              {timeSlots.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => { onChange({ ...state, time: t }); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ${state.time === t ? "text-[#3563E9] font-semibold" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SearchForm() {
  const [pickUp, setPickUp] = useState<SectionState>({ city: "", date: "", time: "" });
  const [dropOff, setDropOff] = useState<SectionState>({ city: "", date: "", time: "" });
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

  function handleSwap() {
    setPickUp(dropOff);
    setDropOff(pickUp);
  }

  return (
    <>
      {/* Backdrop to close dropdowns */}
      {openDropdown && (
        <div className="fixed inset-0 z-20" onClick={() => setOpenDropdown(null)} />
      )}

      <div className="relative z-30 bg-white dark:bg-gray-900 rounded-[10px] p-5 flex flex-col lg:flex-row lg:items-center gap-4 shadow-sm transition-colors duration-300">
        <PickDropSection
          label="Pick - Up"
          dotColor="border-[#3563E9] bg-[#3563E9]"
          prefix="pu"
          state={pickUp}
          onChange={setPickUp}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <button
          type="button"
          aria-label="Swap pick-up and drop-off"
          onClick={handleSwap}
          className="w-10 h-10 rounded-[4px] bg-[#3563E9] hover:bg-[#2a52c9] transition-colors flex items-center justify-center shrink-0 self-center lg:self-auto"
        >
          <ArrowLeftRight size={18} className="text-white" aria-hidden="true" />
        </button>

        <PickDropSection
          label="Drop - Off"
          dotColor="border-[#54A6D4] bg-[#54A6D4]"
          prefix="do"
          state={dropOff}
          onChange={setDropOff}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />
      </div>
    </>
  );
}
