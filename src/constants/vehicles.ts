import type { SelectOption, VehicleTypeSelectOption } from "@/types";

/* ── Marques ─────────────────────────────────────────────── */
export const VEHICLE_MAKES: string[] = [
  "Audi",
  "BMW",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Citroën",
  "Dodge",
  "DS",
  "Ferrari",
  "Ford",
  "Genesis",
  "Geely",
  "Haval",
  "Honda",
  "Hyundai",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Maserati",
  "Mercedes-Benz",
  "NIO",
  "Nissan",
  "Peugeot",
  "Porsche",
  "Renault",
  "SAIC",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

/* ── Types ───────────────────────────────────────────────── */
export const VEHICLE_TYPE_OPTIONS: VehicleTypeSelectOption[] = [
  { value: "SUV", label: "SUV / 4x4", icon: "car-front" },
  { value: "SEDAN", label: "Berline", icon: "car" },
  { value: "COUPE", label: "Coupé", icon: "gauge" },
  { value: "PICKUP", label: "Pickup", icon: "truck" },
  { value: "MINIVAN", label: "Monospace", icon: "bus-front" },
  { value: "CONVERTIBLE", label: "Cabriolet", icon: "sun" },
  { value: "WAGON", label: "Break", icon: "car" },
  { value: "HATCHBACK", label: "Compacte", icon: "car-front" },
  { value: "LUXURY", label: "Luxe", icon: "gem" },
  { value: "SPORT", label: "Sport", icon: "trophy" },
];

/* ── Carburant ───────────────────────────────────────────── */
export const FUEL_TYPE_OPTIONS: SelectOption[] = [
  { value: "GASOLINE", label: "Essence" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Électrique" },
  { value: "HYBRID", label: "Hybride" },
  { value: "PLUGIN_HYBRID", label: "Hybride rechargeable" },
  { value: "HYDROGEN", label: "Hydrogène" },
];

/* ── Transmission ────────────────────────────────────────── */
export const TRANSMISSION_OPTIONS: SelectOption[] = [
  { value: "AUTOMATIC", label: "Automatique" },
  { value: "MANUAL", label: "Manuelle" },
  { value: "CVT", label: "CVT" },
  { value: "DCT", label: "Double embrayage" },
  { value: "PDK", label: "PDK (Porsche)" },
];

/* ── Status ──────────────────────────────────────────────── */
export const VEHICLE_STATUS_OPTIONS: SelectOption[] = [
  { value: "AVAILABLE", label: "Disponible" },
  { value: "TRANSIT", label: "En transit" },
  { value: "RESERVED", label: "Réservé" },
  { value: "SOLD", label: "Vendu" },
  { value: "DRAFT", label: "Brouillon" },
];

/* ── Prix ────────────────────────────────────────────────── */
export const PRICE_RANGES = [
  { label: "Moins de 20 000 000 FCFA", min: 0, max: 20_000_000 },
  { label: "20 000$ – 40 000 000 FCFA", min: 20_000_000, max: 40_000_000 },
  { label: "40 000$ – 60 000 000 FCFA", min: 40_000_000, max: 60_000_000 },
  { label: "60 000$ – 100 000 000 FCFA", min: 60_000_000, max: 100_000_000 },
  { label: "100 000$ – 200 000 000 FCFA", min: 100_000_000, max: 200_000_000 },
  { label: "Plus de 200 000 000 FCFA", min: 200_000_000, max: Infinity },
];

export const PRICE_MIN = 0;
export const PRICE_MAX = 500_000_000;

/* ── Années ──────────────────────────────────────────────── */
export const YEAR_MIN = 2005;
export const YEAR_MAX = new Date().getFullYear() + 1;

export const YEAR_OPTIONS: SelectOption<number>[] = Array.from(
  { length: YEAR_MAX - YEAR_MIN + 1 },
  (_, i) => {
    const y = YEAR_MAX - i;
    return { value: y, label: String(y) };
  },
);

/* ── Kilométrage ──────────────────────────────────────────── */
export const MILEAGE_RANGES = [
  { label: "0 – 10 000 km", max: 10_000 },
  { label: "0 – 30 000 km", max: 30_000 },
  { label: "0 – 50 000 km", max: 50_000 },
  { label: "0 – 100 000 km", max: 100_000 },
  { label: "Tous kilométrages", max: Infinity },
];

/* ── Tri ─────────────────────────────────────────────────── */
export const SORT_OPTIONS: SelectOption[] = [
  { value: "createdAt-desc", label: "Plus récent" },
  { value: "createdAt-asc", label: "Plus ancien" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "year-desc", label: "Année (récent)" },
  { value: "mileage-asc", label: "Km croissant" },
];

/* ── Pagination ──────────────────────────────────────────── */
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];
