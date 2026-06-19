import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="mt-8 w-full border-t border-gray-100 bg-white px-4 transition-colors duration-300 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-6xl py-10">
        <BrandLogo href="/" height={48} />
        <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {siteConfig.description}
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl border-t border-gray-100 py-6 dark:border-gray-800">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
