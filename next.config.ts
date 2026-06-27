import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const laravelApiUrl =
  process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.LARAVEL_API_URL ?? "https://api.limosudcars.com/api";
const apiOrigin = new URL(laravelApiUrl.replace(/\/api\/?$/, "") || laravelApiUrl);
const lanHost = process.env.DEV_LAN_HOST ?? "192.168.1.4";

const storageRemotePattern = {
  protocol: apiOrigin.protocol.replace(":", "") as "http" | "https",
  hostname: apiOrigin.hostname,
  ...(apiOrigin.port ? { port: apiOrigin.port } : {}),
  pathname: "/storage/**",
} as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: [lanHost, `http://${lanHost}:3000`],
  async redirects() {
    return [];
  },
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      storageRemotePattern,
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_ORIGIN: apiOrigin.origin,
  },
};

export default withNextIntl(nextConfig);
