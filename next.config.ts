import type { NextConfig } from "next";

const laravelApiUrl =
  process.env.LARAVEL_API_URL ?? "https://api.limosudcars.com/api";
const apiOrigin = new URL(laravelApiUrl);

const storageRemotePattern = {
  protocol: apiOrigin.protocol.replace(":", "") as "http" | "https",
  hostname: apiOrigin.hostname,
  ...(apiOrigin.port ? { port: apiOrigin.port } : {}),
  pathname: "/storage/**",
} as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [];
  },
  async rewrites() {
    const upstream = laravelApiUrl.replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${upstream}/:path*`,
      },
    ];
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

export default nextConfig;
