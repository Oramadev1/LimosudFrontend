import Link from "next/link";

export default function CarNotFound() {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="text-5xl">🚗</span>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Car not found
      </h1>
      <p className="text-sm text-gray-500">
        This vehicle may no longer be available.
      </p>
      <Link
        href="/cars"
        className="text-sm font-semibold text-[#3563E9] hover:underline"
      >
        Browse all cars
      </Link>
    </main>
  );
}
