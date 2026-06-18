import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { QueryProvider } from "@/components/providers/QueryProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { JsonLd } from "@/components/seo/JsonLd";
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

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('limosud-theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-[#F6F7F9] transition-colors duration-300 dark:bg-gray-950">
        <JsonLd
          data={[
            getOrganizationSchema(),
            getWebSiteSchema(),
            getLocalBusinessSchema(),
          ]}
        />
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
