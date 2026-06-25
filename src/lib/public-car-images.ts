const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif)$/i;

export const PUBLIC_CAR_IMAGES = [
  "/cars/all-new-rush.png",
  "/cars/all-new-terios.png",
  "/cars/cr-v-1.png",
  "/cars/cr-v-2.png",
  "/cars/koenigsegg.png",
  "/cars/moz-excite-blue.png",
  "/cars/moz-exclusive-white.png",
  "/cars/new-mozs-blue.png",
  "/cars/new-mozs-white.png",
  "/cars/nissan-gtr-1.png",
  "/cars/nissan-gtr-2.png",
  "/cars/rolls-royce.png",
] as const;

export function pickPublicCarImage(seed: number, images: readonly string[] = PUBLIC_CAR_IMAGES): string {
  if (images.length === 0) {
    return PUBLIC_CAR_IMAGES[0];
  }

  return images[Math.abs(seed) % images.length] ?? images[0];
}

export function publicCarImageLabel(src: string): string {
  const base = src.split("/").pop()?.replace(/\.[^.]+$/i, "") ?? "Vehicle";

  return base
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function listPublicCarImages(): string[] {
  if (typeof window !== "undefined") {
    return [...PUBLIC_CAR_IMAGES];
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs") as typeof import("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("node:path") as typeof import("node:path");

    const dir = path.join(process.cwd(), "public", "cars");
    if (!fs.existsSync(dir)) {
      return [...PUBLIC_CAR_IMAGES];
    }

    const files = fs
      .readdirSync(dir)
      .filter((file) => IMAGE_EXT.test(file))
      .sort()
      .map((file) => `/cars/${file}`);

    return files.length > 0 ? files : [...PUBLIC_CAR_IMAGES];
  } catch {
    return [...PUBLIC_CAR_IMAGES];
  }
}
