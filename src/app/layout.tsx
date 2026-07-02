import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { QueryProvider } from "@/components/providers/QueryProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { createMetadata } from "@/lib/seo/metadata";
import {
  getLocalBusinessSchema,
  getOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/seo/structured-data";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
});

export const metadata: Metadata = {
  ...createMetadata(),
  icons: {
    icon: siteConfig.logo,
    shortcut: siteConfig.logo,
    apple: siteConfig.logo,
  },
  other: {
    google: "notranslate",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      translate="no"
      className={`${geistSans.variable} notranslate h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('limosud-theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="notranslate flex min-h-full flex-col overflow-x-hidden bg-[#F6F7F9] transition-colors duration-300 dark:bg-gray-950">
        <JsonLd
          data={[
            getOrganizationSchema(),
            getWebSiteSchema(),
            getLocalBusinessSchema(),
          ]}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
