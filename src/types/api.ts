export interface LookupRef {
  id: number;
  name: string;
  slug: string;
  image_path?: string | null;
}

export interface VehiclePhoto {
  id: number;
  path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Vehicle {
  id: number;
  name: string;
  slug: string;
  model: string;
  year: number;
  plate_number: string;
  mileage: number;
  current_mileage_updated_at: string | null;
  seats: number;
  doors: number;
  daily_price: string;
  deposit_amount: string;
  description: string | null;
  is_featured: boolean;
  is_active: boolean;
  brand?: LookupRef;
  category?: LookupRef;
  status?: LookupRef;
  transmission_type?: LookupRef;
  fuel_type?: LookupRef;
  photos?: VehiclePhoto[];
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  address: string;
  delivery_fee: string;
  is_active: boolean;
  location_type?: LookupRef;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  full_name: string;
  nationality: string;
  phone: string;
  email: string | null;
  passport_or_cin: string | null;
  driving_license_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: number;
  reservation_number: string;
  customer: Customer;
  vehicle: Vehicle;
  source: LookupRef;
  status: LookupRef;
  payment_status: LookupRef;
  pickup_location: Location;
  dropoff_location: Location;
  start_datetime: string;
  end_datetime: string;
  total_days: number;
  price_per_day: string;
  delivery_fee: string;
  deposit_amount: string;
  total_price: string;
  customer_notes: string | null;
  admin_notes: string | null;
  confirmed_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicLookups {
  vehicle_brands: Array<LookupRef & { is_active: boolean }>;
  vehicle_categories: Array<
    LookupRef & { description: string | null; is_active: boolean }
  >;
  transmission_types: LookupRef[];
  fuel_types: LookupRef[];
  locations: Array<Omit<Location, "created_at" | "updated_at">>;
}

export interface Paginated<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
  };
}

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface CreateReservationPayload {
  customer: {
    full_name: string;
    nationality: string;
    phone: string;
    email?: string;
    passport_or_cin?: string;
    driving_license_number?: string;
  };
  vehicle_id: number;
  pickup_location_id: number;
  dropoff_location_id: number;
  start_datetime: string;
  end_datetime: string;
  customer_notes?: string;
}
