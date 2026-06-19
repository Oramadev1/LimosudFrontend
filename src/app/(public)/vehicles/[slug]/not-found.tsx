import Link from "next/link";

import { routes } from "@/config/routes";

export default function VehicleNotFound() {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:px-6">
      <span className="text-5xl">🚗</span>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Vehicle not found
      </h1>
      <p className="text-sm text-gray-500">
        This vehicle may no longer be available.
      </p>
      <Link
        href={routes.vehicles}
        className="text-sm font-semibold text-[#3563E9] hover:underline"
      >
        Browse our fleet
      </Link>
    </main>
  );
}
