import { z } from "zod";

/* ── Auth ─────────────────────────────────────────────────── */
export const loginSchema = z.object({
  email: z.email("Email invalide").toLowerCase(),
  password: z.string().min(6, "Minimum 6 caractères"),
});

/* ── Contact ──────────────────────────────────────────────── */
export const contactSchema = z.object({
  firstName: z.string().min(2, "Prénom requis").max(50),
  lastName: z.string().min(2, "Nom requis").max(50),
  email: z.email("Email invalide"),
  phone: z.string().min(7, "Téléphone invalide").max(20),
  subject: z.string().min(2).max(100),
  message: z.string().min(10, "Message trop court").max(2000),
  honeypot: z.string().max(0, "Bot detected").optional(), // anti-spam
});

/* ── Devis ────────────────────────────────────────────────── */
export const devisSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.email(),
  phone: z.string().min(7).max(20),
  desiredVehicle: z.string().min(2).max(200),
  preferredCountry: z.string().optional(),
  budget: z.number().min(1000).max(5_000_000).optional(),
  message: z.string().max(1000).optional(),
});

/* ── Vehicle ──────────────────────────────────────────────── */
export const vehicleSchema = z.object({
  make: z.string().min(1, "Marque requise").max(50),
  model: z.string().min(1, "Modèle requis").max(100),
  variant: z.string().max(100).optional(),
  year: z
    .number()
    .min(1990)
    .max(new Date().getFullYear() + 1),
  type: z.enum([
    "SUV",
    "SEDAN",
    "COUPE",
    "PICKUP",
    "MINIVAN",
    "CONVERTIBLE",
    "WAGON",
    "HATCHBACK",
    "LUXURY",
    "SPORT",
  ]),
  engine: z.string().max(100).optional(),
  power: z.number().min(0).max(2000).optional(),
  torque: z.number().min(0).max(3000).optional(),
  fuelType: z.enum([
    "GASOLINE",
    "DIESEL",
    "ELECTRIC",
    "HYBRID",
    "PLUGIN_HYBRID",
    "HYDROGEN",
  ]),
  transmission: z.enum(["AUTOMATIC", "MANUAL", "CVT", "DCT", "PDK"]),
  mileage: z.number().min(0).max(999_999),
  color: z.string().min(1).max(50),
  interiorColor: z.string().max(50).optional(),
  doors: z.number().min(2).max(6).optional(),
  seats: z.number().min(1).max(9).optional(),
  acceleration: z.number().min(0).max(30).optional(),
  topSpeed: z.number().min(0).max(500).optional(),
  consumption: z.number().min(0).max(50).optional(),
  autonomy: z.number().min(0).max(2000).optional(),
  price: z.number().min(1000).max(200_000_000),
  priceNegotiable: z.boolean().optional(),
  comparePrice: z.number().optional(),
  status: z.enum(["AVAILABLE", "TRANSIT", "RESERVED", "SOLD", "DRAFT"]),
  stock: z.number().min(0).optional(),
  originCountry: z.enum([
    "JAPAN",
    "GERMANY",
    "FRANCE",
    "SOUTH_KOREA",
    "CHINA",
    "DUBAI",
    "USA",
    "EUROPE",
  ]),
  customsCleared: z.boolean().optional(),
  chassisNumber: z.string().max(17).optional(),
  description: z.string().max(5000).optional(),
  features: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

/* ── Filters ──────────────────────────────────────────────── */
export const vehicleFiltersSchema = z.object({
  search: z.string().optional(),
  make: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  fuelType: z.array(z.string()).optional(),
  transmission: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  country: z.array(z.string()).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minYear: z.coerce.number().optional(),
  maxYear: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  sortBy: z
    .enum(["price", "year", "mileage", "createdAt", "publishedAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

/* ── Admin request update ─────────────────────────────────── */
export const updateRequestSchema = z.object({
  status: z
    .enum([
      "NEW",
      "CONTACTED",
      "IN_PROGRESS",
      "QUOTE_SENT",
      "CONFIRMED",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
  adminNotes: z.string().max(2000).optional(),
  assignedTo: z.string().optional(),
});

/* ── Types inférés ────────────────────────────────────────── */
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type DevisInput = z.infer<typeof devisSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehicleFiltersInput = z.infer<typeof vehicleFiltersSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
