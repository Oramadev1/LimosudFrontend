export function VehicleImagePlaceholder({ label = "No photo" }: { label?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-300 dark:bg-gray-800 dark:text-gray-600">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-4xl" aria-hidden>
          🚗
        </span>
        <span className="text-xs font-medium">{label}</span>
      </div>
    </div>
  );
}
