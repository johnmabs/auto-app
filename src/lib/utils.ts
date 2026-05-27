import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* ── cn() — Tailwind class merger ────────────────────────── */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ── Prix ─────────────────────────────────────────────────── */
export function formatPrice(
  amount: number,
  currency: string = "XAF",
  locale: string = "fr-FR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceShort(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

/* ── Kilométrage ──────────────────────────────────────────── */
export function formatMileage(km: number): string {
  return new Intl.NumberFormat("fr-FR").format(km) + " km";
}

/* ── Slug ─────────────────────────────────────────────────── */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateVehicleSlug(
  make: string,
  model: string,
  year: number,
  id: string,
): string {
  return `${slugify(make)}-${slugify(model)}-${year}-${id.slice(-6)}`;
}

/* ── Dates ────────────────────────────────────────────────── */
export function formatDate(
  date: Date | string,
  format: "short" | "long" | "relative" = "short",
): string {
  const d = new Date(date);

  if (format === "relative") {
    const now = Date.now();
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60_000);
    const hrs = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (mins < 1) return "à l'instant";
    if (mins < 60) return `il y a ${mins} min`;
    if (hrs < 24) return `il y a ${hrs}h`;
    if (days < 7) return `il y a ${days}j`;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: format === "long" ? "long" : "short",
    timeStyle: format === "long" ? "short" : undefined,
  }).format(d);
}

/* ── Nombres ──────────────────────────────────────────────── */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export function formatPercentage(n: number, decimals: number = 1): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(decimals)}%`;
}

/* ── Strings ─────────────────────────────────────────────── */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/* ── URL ─────────────────────────────────────────────────── */
export function buildSearchParams(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      sp.set(k, String(v));
    }
  }
  const str = sp.toString();
  return str ? `?${str}` : "";
}

/* ── WhatsApp ─────────────────────────────────────────────── */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encoded}`;
}

export function buildVehicleWhatsAppMessage(
  make: string,
  model: string,
  year: number,
  url: string,
): string {
  return `Bonjour ! Je suis intéressé(e) par le véhicule suivant :\n\n🚗 ${make} ${model} ${year}\n🔗 ${url}\n\nMerci de me contacter pour plus d'informations.`;
}

/* ── Validation ──────────────────────────────────────────── */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone);
}

/* ── Image ────────────────────────────────────────────────── */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "jpg" | "png";
  } = {},
): string {
  const { width, height, quality = 80, format = "webp" } = options;
  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    "c_fill",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

/* ── Misc ─────────────────────────────────────────────────── */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) delete result[key];
  return result as Omit<T, K>;
}
