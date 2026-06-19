"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { subscribe, ToastItem } from "@/lib/toast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => subscribe(setToasts), []);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-[min(320px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-fade-in-down flex items-start gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            t.type === "success"
              ? "border border-green-200 bg-green-600 text-white dark:border-green-800 dark:bg-green-700"
              : t.type === "error"
                ? "border border-red-200 bg-red-600 text-white dark:border-red-900 dark:bg-red-700"
                : "bg-gray-800 text-white dark:bg-gray-700"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          ) : t.type === "error" ? (
            <XCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          ) : null}
          {t.icon ? <span>{t.icon}</span> : null}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
