import type {
  Vehicle as PrismaVehicle,
  VehicleImage,
  VehicleStatus,
  FuelType,
  TransmissionType,
  VehicleType,
  Country,
} from "@/lib/generated/prisma/client";

// ─── Vehicle avec images ───────────────────────────────────

export type VehicleWithImages = PrismaVehicle & {
  images: VehicleImage[];
};

export type VehicleCardData = Pick<
  PrismaVehicle,
  | "id"
  | "slug"
  | "make"
  | "model"
  | "variant"
  | "year"
  | "type"
  | "fuelType"
  | "transmission"
  | "mileage"
  | "color"
  | "price"
  | "comparePrice"
  | "status"
  | "originCountry"
  | "isFeatured"
  | "isPopular"
> & {
  images: Pick<VehicleImage, "url" | "alt" | "isPrimary">[];
};

// ─── Filtres catalogue ─────────────────────────────────────

export interface VehicleFilters {
  search?: string;
  make?: string[];
  type?: VehicleType[];
  fuelType?: FuelType[];
  transmission?: TransmissionType[];
  status?: VehicleStatus[];
  country?: Country[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: VehicleSortKey;
  sortOrder?: "asc" | "desc";
}

export type VehicleSortKey =
  | "price"
  | "year"
  | "mileage"
  | "createdAt"
  | "publishedAt";

// ─── Réponse paginée ───────────────────────────────────────

export interface PaginatedVehicles {
  vehicles: VehicleCardData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Formulaire création/édition ──────────────────────────

export interface VehicleFormData {
  make: string;
  model: string;
  variant?: string;
  year: number;
  type: VehicleType;
  engine?: string;
  power?: number;
  torque?: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  mileage: number;
  color: string;
  interiorColor?: string;
  doors?: number;
  seats?: number;
  acceleration?: number;
  topSpeed?: number;
  consumption?: number;
  autonomy?: number;
  price: number;
  priceNegotiable?: boolean;
  comparePrice?: number;
  status: VehicleStatus;
  stock?: number;
  originCountry: Country;
  customsCleared?: boolean;
  chassisNumber?: string;
  description?: string;
  features?: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// ─── Re-exports Prisma enums ───────────────────────────────

export type {
  VehicleStatus,
  FuelType,
  TransmissionType,
  VehicleType,
  Country,
  VehicleImage,
};
