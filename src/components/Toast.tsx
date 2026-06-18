"use client";

import { useEffect, useState } from "react";
import { subscribe, ToastItem } from "@/lib/toast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => subscribe(setToasts), []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-fade-in-down flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white max-w-[320px] ${
            t.type === "success"
              ? "bg-[#3563E9]"
              : t.type === "error"
              ? "bg-red-500"
              : "bg-gray-800"
          }`}
        >
          {t.icon && <span>{t.icon}</span>}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
