import Link from "next/link";
import Image from "next/image";
import { cn, formatMileage } from "@/lib/utils";
import { PriceTag } from "@/components/shared/PriceTag";
import { CountryBadge } from "@/components/shared/CountryBadge";
import type { VehicleCardData } from "@/types/vehicle";
import { FUEL_TYPE_OPTIONS, TRANSMISSION_OPTIONS } from "@/constants/vehicles";

/* ── Status badge ────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    AVAILABLE: {
      label: "Disponible",
      className:
        "bg-[rgba(46,204,113,0.12)] text-[var(--green)] border-[rgba(46,204,113,0.3)]",
    },
    TRANSIT: {
      label: "En transit",
      className:
        "bg-[rgba(52,152,219,0.12)] text-[var(--blue)] border-[rgba(52,152,219,0.3)]",
    },
    RESERVED: {
      label: "Réservé",
      className:
        "bg-[rgba(201,168,76,0.12)] bg-(--gold) border-[rgba(201,168,76,0.3)]",
    },
    SOLD: {
      label: "Vendu",
      className:
        "bg-[rgba(90,88,102,0.2)] text-[var(--muted)] border-[var(--border)]",
    },
    DRAFT: {
      label: "Brouillon",
      className:
        "bg-[rgba(90,88,102,0.2)] text-[var(--dim)] border-[var(--border)]",
    },
  };

  const s = config[status] ?? config["AVAILABLE"]!;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full",
        "text-[0.65rem] font-semibold uppercase tracking-[0.08em] border",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}

/* ── Featured / Popular badge ────────────────────────────── */
function TopBadge({
  isFeatured,
  isPopular,
}: {
  isFeatured?: boolean;
  isPopular?: boolean;
}) {
  if (isFeatured) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.08em] bg-(--gold) border border-[rgba(201,168,76,0.35)]">
        ★ Coup de cœur
      </span>
    );
  }
  if (isPopular) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.08em] bg-[rgba(230,57,70,0.12)] text-(--accent) border border-[rgba(230,57,70,0.3)]">
        🔥 Populaire
      </span>
    );
  }
  return null;
}

/* ── Spec item ───────────────────────────────────────────── */
function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[0.82rem] font-medium text-(--text)">
        {value}
      </span>
      <span className="text-[0.62rem] uppercase tracking-[0.08em] text-(--dim)">
        {label}
      </span>
    </div>
  );
}

/* ── VehicleCard ─────────────────────────────────────────── */
interface VehicleCardProps {
  vehicle: VehicleCardData;
  priority?: boolean; // LCP image optimisation
  className?: string;
}

export function VehicleCard({
  vehicle,
  priority = false,
  className,
}: VehicleCardProps) {
  const primaryImage =
    vehicle.images.find((img) => img.isPrimary) ?? vehicle.images[0];

  const fuelLabel =
    FUEL_TYPE_OPTIONS.find((f) => f.value === vehicle.fuelType)?.label ??
    vehicle.fuelType;
  const transLabel =
    TRANSMISSION_OPTIONS.find((t) => t.value === vehicle.transmission)?.label ??
    vehicle.transmission;

  return (
    <article
      className={cn(
        "group relative flex flex-col",
        "bg-(--bg-2) border border-(--border) rounded-(--r-lg)",
        "overflow-hidden",
        "transition-all duration-300",
        "hover:border-(--border-2) hover:-translate-y-1",
        "hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]",
        vehicle.status === "SOLD" && "opacity-70",
        className,
      )}
    >
      {/* ── Image ─────────────────────────────────────── */}
      <div className="relative h-50 bg-(--bg-3) overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={
              primaryImage.alt ??
              `${vehicle.make} ${vehicle.model} ${vehicle.year}`
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-(--bg-3) to-(--bg-4)">
            <span className="text-6xl opacity-30 relative" aria-hidden="true">
              <Image
                src="/images/placeholders/vehicle-placeholder.jpg"
                alt="Véhicule sans photo"
                fill
                className="object-cover object-left"
                sizes="56px"
              />
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"
          aria-hidden="true"
        />

        {/* Top-left badges */}
        <div
          className="absolute top-3 left-3 flex flex-wrap gap-1.5"
          aria-label="Statut"
        >
          <StatusBadge status={vehicle.status} />
          <TopBadge
            isFeatured={vehicle.isFeatured}
            isPopular={vehicle.isPopular}
          />
        </div>

        {/* Country badge top-right */}
        <div className="absolute top-3 right-3">
          <CountryBadge
            country={vehicle.originCountry}
            size="sm"
            variant="full"
          />
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Make + Model */}
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-(--muted) mb-1">
          {vehicle.make}
        </p>
        <h3 className="font-display text-[1.5rem] tracking-[0.03em] leading-none mb-1">
          {vehicle.model}
          {vehicle.variant && (
            <span className="font-sans text-[0.75rem] text-(--muted) ml-2 font-normal tracking-normal align-middle">
              {vehicle.variant}
            </span>
          )}
        </h3>
        <p className="font-mono text-[0.75rem] text-(--dim) mb-4">
          {vehicle.year} · {vehicle.color}
        </p>

        {/* Specs */}
        <div className="flex gap-4 py-3.5 border-y border-(--border) mb-4">
          <SpecItem
            label="Kilométrage"
            value={formatMileage(vehicle.mileage)}
          />
          <SpecItem label="Carburant" value={fuelLabel} />
          <SpecItem label="Boîte" value={transLabel} />
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between mt-auto">
          <PriceTag
            price={vehicle.price}
            comparePrice={vehicle.comparePrice ?? undefined}
            size="sm"
            showLabel
          />

          <Link
            href={`/vehicles/${vehicle.slug}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-(--r)",
              "text-[0.75rem] font-medium uppercase tracking-wider",
              "border border-(--border-2) text-(--text)",
              "transition-all duration-200",
              "hover:bg-(--gold) hover:border-(--gold) hover:text-(--bg)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--gold)",
            )}
            aria-label={`Voir les détails du ${vehicle.make} ${vehicle.model} ${vehicle.year}`}
          >
            Voir
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
