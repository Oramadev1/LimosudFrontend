export interface MarketingCar {
  id: number;
  name: string;
  year: number;
  image: string | null;
  brand?: string;
  model?: string;
  category?: string;
  seats: number;
  fuel: string;
  transmission: string;
  price: number;
  priceUnit?: "/day" | "";
  type: "rent" | "buy";
  href?: string;
  isFeatured?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}
