import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <p className="text-8xl font-extrabold text-[#3563E9] mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="bg-[#3563E9] hover:bg-[#2a52c9] transition-colors text-white font-semibold px-6 py-3 rounded-[4px] inline-block"
            >
              Go to Home
            </Link>
            <Link
              href="/cars"
              className="border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-[4px] inline-block"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
