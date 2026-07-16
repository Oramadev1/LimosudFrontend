import type { Testimonial } from "@/types/marketing";

function avatarForName(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3563E9&color=fff&size=80`;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Villa Karima prestige",
    role: "Google review",
    avatar: avatarForName("Villa Karima"),
    rating: 5,
    quote:
      "Great experience with LIMOSudcars in Dakhla! Friendly staff, clean car, and smooth service from start to finish. Highly recommended!",
  },
  {
    id: 2,
    name: "Fouzia El Moussaoui",
    role: "Google review",
    avatar: avatarForName("Fouzia El Moussaoui"),
    rating: 5,
    quote:
      "Great service, car was brought to the hotel and returned at the Airport. The car was very good and clean. Thank you very much.",
  },
  {
    id: 3,
    name: "Achraf HDR",
    role: "Google review",
    avatar: avatarForName("Achraf HDR"),
    rating: 5,
    quote:
      "Excellent service and very professional staff. The car was clean, well maintained, and the rental process was quick and easy. I highly recommend LIMOSUD CARS for anyone looking for reliable car rental.",
  },
];
