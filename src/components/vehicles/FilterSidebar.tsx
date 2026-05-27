"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { VehicleTypeIcon } from "@/components/vehicles/VehicleTypeIcon";
import { COUNTRIES } from "@/constants/countries";
import {
  VEHICLE_TYPE_OPTIONS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  PRICE_MIN,
  PRICE_MAX,
  YEAR_MIN,
  YEAR_MAX,
} from "@/constants/vehicles";

/* ── FilterGroup ─────────────────────────────────────────── */
function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-(--border) pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-[0.72rem] font-semibold uppercase tracking-widest text-(--muted)">
          {title}
        </span>
        <span
          className={cn(
            "text-(--dim) transition-transform duration-200 text-xs",
            open ? "rotate-180" : "",
          )}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && <div className="space-y-2 mt-1">{children}</div>}
    </div>
  );
}

/* ── CheckboxItem ────────────────────────────────────────── */
function CheckboxItem({
  label,
  value,
  checked,
  onChange,
  count,
}: {
  label: React.ReactNode;
  value: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
  count?: number;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="w-3.5 h-3.5 rounded accent-(--gold) cursor-pointer"
      />
      <span
        className={cn(
          "text-[0.82rem] flex-1 transition-colors",
          checked
            ? "text-(--text)"
            : "text-(--muted) group-hover:text-(--text)",
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="text-[0.65rem] text-(--dim) font-mono">{count}</span>
      )}
    </label>
  );
}

/* ── RangeInput ──────────────────────────────────────────── */
function RangeInput({
  label,
  min,
  max,
  value,
  onChange,
  format = (v) => String(v),
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-(--gold) cursor-pointer"
        aria-label={label}
      />
      <div className="flex justify-between text-[0.68rem] text-(--dim) font-mono mt-1">
        <span>{format(min)}</span>
        <span className="bg-(--gold) font-medium">{format(value)}</span>
      </div>
    </div>
  );
}

/* ── FilterSidebar ───────────────────────────────────────── */
interface FilterState {
  countries: string[];
  types: string[];
  fuels: string[];
  transmissions: string[];
  makes: string[];
  maxPrice: number;
  maxYear: number;
  minYear: number;
  status: string[];
}

export function FilterSidebar({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* Init state depuis searchParams */
  const [filters, setFilters] = React.useState<FilterState>({
    countries: searchParams.getAll("country"),
    types: searchParams.getAll("type"),
    fuels: searchParams.getAll("fuel"),
    transmissions: searchParams.getAll("transmission"),
    makes: searchParams.getAll("make"),
    maxPrice: Number(searchParams.get("maxPrice")) || PRICE_MAX,
    minYear: Number(searchParams.get("minYear")) || YEAR_MIN,
    maxYear: Number(searchParams.get("maxYear")) || YEAR_MAX,
    status: searchParams.getAll("status"),
  });

  const activeCount = React.useMemo(() => {
    return (
      filters.countries.length +
      filters.types.length +
      filters.fuels.length +
      filters.transmissions.length +
      filters.makes.length +
      (filters.maxPrice < PRICE_MAX ? 1 : 0) +
      (filters.minYear > YEAR_MIN ? 1 : 0) +
      (filters.maxYear < YEAR_MAX ? 1 : 0) +
      filters.status.length
    );
  }, [filters]);

  /* Helpers */
  function toggleArray(
    key: keyof FilterState,
    value: string,
    checked: boolean,
  ) {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: checked ? [...arr, value] : arr.filter((v) => v !== value),
      };
    });
  }

  /* Apply → push searchParams */
  function apply() {
    const params = new URLSearchParams();
    params.set("page", "1");

    filters.countries.forEach((v) => params.append("country", v));
    filters.types.forEach((v) => params.append("type", v));
    filters.fuels.forEach((v) => params.append("fuel", v));
    filters.transmissions.forEach((v) => params.append("transmission", v));
    filters.makes.forEach((v) => params.append("make", v));
    filters.status.forEach((v) => params.append("status", v));

    if (filters.maxPrice < PRICE_MAX)
      params.set("maxPrice", String(filters.maxPrice));
    if (filters.minYear > YEAR_MIN)
      params.set("minYear", String(filters.minYear));
    if (filters.maxYear < YEAR_MAX)
      params.set("maxYear", String(filters.maxYear));

    router.push(`${pathname}?${params.toString()}`);
  }

  /* Reset */
  function reset() {
    setFilters({
      countries: [],
      types: [],
      fuels: [],
      transmissions: [],
      makes: [],
      maxPrice: PRICE_MAX,
      minYear: YEAR_MIN,
      maxYear: YEAR_MAX,
      status: [],
    });
    router.push(pathname);
  }

  return (
    <aside
      className={cn(
        "bg-(--bg-2) border border-(--border) rounded-(--r-lg)",
        "p-5 sticky top-[calc(var(--nav-h)+1rem)]",
        className,
      )}
      aria-label="Filtres du catalogue"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className="h-4 w-4 text-(--muted)"
            aria-hidden="true"
          />
          <span className="text-[0.82rem] font-semibold text-(--text)">
            Filtres
          </span>
          {activeCount > 0 && (
            <span className="text-[0.65rem] bg-(--gold) text-(--bg) px-1.5 py-0.5 rounded-full font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-[0.72rem] text-(--muted) hover:text-(--accent) transition-colors"
            aria-label="Réinitialiser tous les filtres"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="space-y-0">
        {/* Pays d'importation */}
        <FilterGroup title="Pays d'importation">
          {COUNTRIES.filter((c) => c.active).map((country) => (
            <CheckboxItem
              key={country.code}
              label={`${country.flag} ${country.name}`}
              value={country.code}
              checked={filters.countries.includes(country.code)}
              onChange={(v, checked) => toggleArray("countries", v, checked)}
            />
          ))}
        </FilterGroup>

        {/* Type de véhicule */}
        <FilterGroup title="Type de véhicule">
          {VEHICLE_TYPE_OPTIONS.map((opt) => (
            <CheckboxItem
              key={opt.value}
              label={
                <span className="flex items-center gap-2">
                  <VehicleTypeIcon name={opt.icon} />
                  {opt.label}
                </span>
              }
              value={opt.value}
              checked={filters.types.includes(opt.value)}
              onChange={(v, checked) => toggleArray("types", v, checked)}
            />
          ))}
        </FilterGroup>

        {/* Budget */}
        <FilterGroup title="Budget maximum">
          <RangeInput
            label="Budget maximum"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={filters.maxPrice}
            onChange={(v) => setFilters((p) => ({ ...p, maxPrice: v }))}
            format={(v) =>
              v >= PRICE_MAX
                ? "Illimité"
                : new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(v)
            }
          />
        </FilterGroup>

        {/* Carburant */}
        <FilterGroup title="Carburant">
          {FUEL_TYPE_OPTIONS.map((opt) => (
            <CheckboxItem
              key={opt.value}
              label={opt.label}
              value={opt.value}
              checked={filters.fuels.includes(opt.value)}
              onChange={(v, checked) => toggleArray("fuels", v, checked)}
            />
          ))}
        </FilterGroup>

        {/* Transmission */}
        <FilterGroup title="Transmission" defaultOpen={false}>
          {TRANSMISSION_OPTIONS.map((opt) => (
            <CheckboxItem
              key={opt.value}
              label={opt.label}
              value={opt.value}
              checked={filters.transmissions.includes(opt.value)}
              onChange={(v, checked) =>
                toggleArray("transmissions", v, checked)
              }
            />
          ))}
        </FilterGroup>

        {/* Disponibilité */}
        <FilterGroup title="Disponibilité" defaultOpen={false}>
          {[
            { value: "AVAILABLE", label: "En stock" },
            { value: "TRANSIT", label: "En transit" },
            { value: "RESERVED", label: "Sur commande" },
          ].map((opt) => (
            <CheckboxItem
              key={opt.value}
              label={opt.label}
              value={opt.value}
              checked={filters.status.includes(opt.value)}
              onChange={(v, checked) => toggleArray("status", v, checked)}
            />
          ))}
        </FilterGroup>
      </div>

      {/* Apply button */}
      <Button fullWidth className="mt-5" onClick={apply}>
        Appliquer les filtres
        {activeCount > 0 && ` (${activeCount})`}
      </Button>
    </aside>
  );
}
