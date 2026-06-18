export type ToastItem = {
  id: number;
  message: string;
  type: "success" | "error" | "default";
  icon?: string;
};

let listeners: ((toasts: ToastItem[]) => void)[] = [];
let toasts: ToastItem[] = [];
let nextId = 0;

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export function showToast(
  message: string,
  opts?: { type?: ToastItem["type"]; icon?: string; duration?: number }
) {
  const id = nextId++;
  toasts = [...toasts, { id, message, type: opts?.type ?? "default", icon: opts?.icon }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, opts?.duration ?? 3000);
}

export const toast = {
  success: (msg: string, opts?: { duration?: number }) =>
    showToast(msg, { type: "success", ...opts }),
  error: (msg: string, opts?: { duration?: number }) =>
    showToast(msg, { type: "error", ...opts }),
};

export function subscribe(listener: (toasts: ToastItem[]) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
