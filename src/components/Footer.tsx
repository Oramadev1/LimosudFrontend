import { siteConfig } from "@/config/site";

const footerLinks = {
  About: ["How it works", "Featured", "Partnership", "Business Relation"],
  Community: ["Events", "Blog", "Podcast", "Invite a friend"],
  Socials: ["Discord", "Instagram", "Twitter", "Facebook"],
};

export default function Footer() {
  return (
    <footer className="mt-8 w-full border-t border-gray-100 bg-white px-6 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900">
      <div className="w-full py-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-[240px]">
            <span className="text-2xl font-bold tracking-wide text-[#3563E9]">
              {siteConfig.brand}
            </span>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {siteConfig.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-20">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">
                  {heading}
                </h4>
                <ul className="flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link}>
                      <span className="cursor-default text-sm text-gray-400 transition-colors hover:text-[#3563E9]">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 py-6 sm:flex-row dark:border-gray-800">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved
        </span>
        <div className="flex gap-8">
          <span className="cursor-default text-sm font-semibold text-gray-700 transition-colors hover:text-[#3563E9] dark:text-gray-300">
            Privacy & Policy
          </span>
          <span className="cursor-default text-sm font-semibold text-gray-700 transition-colors hover:text-[#3563E9] dark:text-gray-300">
            Terms & Condition
          </span>
        </div>
      </div>
    </footer>
  );
}
