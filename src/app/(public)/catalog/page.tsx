import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { FilterSidebar } from "@/components/vehicles/FilterSidebar";
import { SortSelect } from "@/components/vehicles/SortSelect";
import {
  VehicleGridSkeleton,
  FilterSidebarSkeleton,
} from "@/components/ui/Skeleton";
import { getVehicles } from "@/actions/vehicle.actions";
import { cn } from "@/lib/utils";

/* ── Metadata ────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Catalogue — Véhicules importés premium",
  description:
    "Parcourez notre catalogue complet de véhicules importés depuis 8 pays. Filtres avancés, prix transparents, disponibilité en temps réel.",
};

/* ── Types searchParams ──────────────────────────────────── */
interface CatalogueSearchParams {
  page?: string;
  country?: string | string[];
  type?: string | string[];
  fuel?: string | string[];
  make?: string | string[];
  status?: string | string[];
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  featured?: string;
  transmission?: string;
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

/* ── Breadcrumb ──────────────────────────────────────────── */
function Breadcrumb({ total }: { total: number }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="flex items-center gap-2 text-[0.78rem] text-(--muted)"
    >
      <Link href="/" className="hover:text-(--gold) transition-colors">
        Accueil
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-(--text)">Catalogue</span>
      <span aria-hidden="true">·</span>
      <span className="font-mono text-(--dim)">
        {total} résultat{total !== 1 ? "s" : ""}
      </span>
    </nav>
  );
}

/* ── Pagination ──────────────────────────────────────────── */
function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function buildUrl(p: number) {
    const params = new URLSearchParams({ ...searchParams, page: String(p) });
    return `/catalogue?${params.toString()}`;
  }

  /* Pages visibles */
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-12"
      aria-label="Pagination du catalogue"
    >
      {/* Prev */}
      {page > 1 && (
        <Link
          href={buildUrl(page - 1)}
          className="h-9 px-4 flex items-center text-[0.8rem] text-(--muted)
                     border border-(--border) rounded-(--r)
                     hover:border-(--border-2) hover:text-(--text) transition-all"
          aria-label="Page précédente"
        >
          ← Précédent
        </Link>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="h-9 w-9 flex items-center justify-center text-(--dim) text-sm"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "h-9 w-9 flex items-center justify-center rounded-(--r)",
              "text-[0.82rem] font-medium transition-all border",
              p === page
                ? "bg-(--gold) text-(--bg) border-(--gold)"
                : "border-(--border) text-(--muted) hover:border-(--border-2) hover:text-(--text)",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {/* Next */}
      {page < totalPages && (
        <Link
          href={buildUrl(page + 1)}
          className="h-9 px-4 flex items-center text-[0.8rem] text-(--muted)
                     border border-(--border) rounded-(--r)
                     hover:border-(--border-2) hover:text-(--text) transition-all"
          aria-label="Page suivante"
        >
          Suivant →
        </Link>
      )}
    </nav>
  );
}

/* ── Empty state ─────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-6 opacity-20" aria-hidden="true">
        🚗
      </div>
      <h3 className="font-display text-2xl tracking-wide mb-3">
        AUCUN VÉHICULE TROUVÉ
      </h3>
      <p className="text-[0.88rem] text-(--muted) max-w-sm mb-8 leading-relaxed">
        Aucun véhicule ne correspond à vos critères de recherche. Essayez
        d&apos;élargir vos filtres.
      </p>
      <div className="flex gap-3">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-(--r)
                     bg-(--gold) text-(--bg) text-[0.82rem] font-medium uppercase tracking-wider
                     hover:bg-(--gold-2) transition-colors"
        >
          Réinitialiser les filtres
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-(--r)
                     border border-(--border-2) text-(--text) text-[0.82rem] font-medium uppercase tracking-wider
                     hover:border-(--gold) hover:text-(--gold) transition-all"
        >
          Demande personnalisée
        </Link>
      </div>
    </div>
  );
}

/* ── Active filters pills ────────────────────────────────── */
function ActiveFilterPills({
  searchParams,
}: {
  searchParams: CatalogueSearchParams;
}) {
  const pills: { label: string; removeKey: string; removeVal?: string }[] = [];

  const countryMap: Record<string, string> = {
    CHINA: "🇨🇳 Chine",
    DUBAI: "🇦🇪 Dubai",
    JAPAN: "🇯🇵 Japon",
    GERMANY: "🇩🇪 Allemagne",
    SOUTH_KOREA: "🇰🇷 Corée",
    USA: "🇺🇸 USA",
    FRANCE: "🇫🇷 France",
    EUROPE: "🇪🇺 Europe",
  };

  toArray(searchParams.country).forEach((c) => {
    pills.push({
      label: countryMap[c] ?? c,
      removeKey: "country",
      removeVal: c,
    });
  });

  if (searchParams.maxPrice) {
    pills.push({
      label: `Max ${Number(searchParams.maxPrice).toLocaleString("fr-FR")} $`,
      removeKey: "maxPrice",
    });
  }

  toArray(searchParams.type).forEach((t) => {
    pills.push({ label: t, removeKey: "type", removeVal: t });
  });

  toArray(searchParams.fuel).forEach((f) => {
    pills.push({ label: f, removeKey: "fuel", removeVal: f });
  });

  if (pills.length === 0) return null;

  return (
    <div
      className="flex flex-wrap gap-2 mb-5"
      role="list"
      aria-label="Filtres actifs"
    >
      {pills.map((pill, i) => {
        const params = new URLSearchParams();
        // rebuild params without this pill
        Object.entries(searchParams).forEach(([k, v]) => {
          if (k === pill.removeKey) {
            if (pill.removeVal && Array.isArray(v)) {
              (v as string[])
                .filter((x) => x !== pill.removeVal)
                .forEach((x) => params.append(k, x));
            } else if (pill.removeVal && v === pill.removeVal) {
              // skip
            } else if (!pill.removeVal) {
              // skip (remove entire key)
            } else {
              params.append(k, v as string);
            }
          } else if (v) {
            const vals = Array.isArray(v) ? v : [v];
            vals.forEach((x) => params.append(k, x));
          }
        });

        return (
          <Link
            key={i}
            href={`/catalogue?${params.toString()}`}
            role="listitem"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                       bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)]
                       text-(--gold) text-[0.72rem] font-medium
                       hover:bg-[rgba(201,168,76,0.2)] transition-colors"
            aria-label={`Supprimer le filtre : ${pill.label}`}
          >
            {pill.label}
            <span aria-hidden="true">×</span>
          </Link>
        );
      })}

      <Link
        href="/catalogue"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                   border border-(--border) text-(--muted) text-[0.72rem]
                   hover:border-(--accent) hover:text-(--accent) transition-all"
        aria-label="Supprimer tous les filtres"
      >
        Tout effacer ×
      </Link>
    </div>
  );
}

/* ── Vehicles grid (async) ───────────────────────────────── */
async function VehiclesGrid({
  searchParams,
}: {
  searchParams: CatalogueSearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const sortStr = searchParams.sortBy ?? "createdAt-desc";
  const [sortBy, sortOrder] = sortStr.split("-") as [string, "asc" | "desc"];

  const result = await getVehicles({
    page,
    limit: 12,
    country: toArray(searchParams.country),
    type: toArray(searchParams.type),
    fuel: toArray(searchParams.fuel),
    transmission: toArray(searchParams.transmission),
    make: toArray(searchParams.make),
    status:
      toArray(searchParams.status).length > 0
        ? toArray(searchParams.status)
        : ["AVAILABLE", "TRANSIT"],
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minYear: searchParams.minYear ? Number(searchParams.minYear) : undefined,
    maxYear: searchParams.maxYear ? Number(searchParams.maxYear) : undefined,
    search: searchParams.search,
    sortBy: sortBy ?? "createdAt",
    sortOrder: sortOrder ?? "desc",
    featuredOnly: searchParams.featured === "true",
  });

  const { vehicles, total, totalPages } = result;

  // Build clean searchParams for pagination URLs
  const cleanParams: Record<string, string> = {};
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v && k !== "page") cleanParams[k] = Array.isArray(v) ? v[0]! : v;
  });

  if (vehicles.length === 0) return <EmptyState />;

  return (
    <>
      {/* Count + sort */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-[0.82rem] text-(--muted)">
          <span className="text-(--text) font-medium">{total}</span> véhicule
          {total !== 1 ? "s" : ""}
          {page > 1 && ` · Page ${page} sur ${totalPages}`}
        </p>
        <SortSelect currentSort={sortStr} />
      </div>

      {/* Active filters */}
      <ActiveFilterPills searchParams={searchParams} />

      {/* Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
        role="list"
        aria-label="Liste des véhicules"
      >
        {vehicles.map((vehicle, i) => (
          <div key={vehicle.id} role="listitem">
            <VehicleCard vehicle={vehicle} priority={i < 3} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        searchParams={cleanParams}
      />
    </>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<CatalogueSearchParams>;
}) {
  const params = await searchParams;

  return (
    <div className="pt-(--nav-h)">
      {/* Page header */}
      <div className="bg-(--bg-2) border-b border-(--border) px-6 lg:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb total={0} />
          <div className="mt-4 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="section-tag mb-2" aria-hidden="true">
                Catalogue complet
              </p>
              <h1 className="font-display text-[clamp(2.5rem,6vw,3.5rem)] tracking-[0.04em]">
                NOS VÉHICULES
              </h1>
            </div>
            {/* Mobile filter toggle hint */}
            <div className="flex items-center gap-2 text-[0.78rem] text-(--muted) lg:hidden">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filtres disponibles ci-dessous
            </div>
          </div>
        </div>
      </div>

      {/* Layout grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex gap-8 items-start">
          {/* Sidebar */}
          <div className="hidden lg:block w-65 shrink-0">
            <Suspense fallback={<FilterSidebarSkeleton />}>
              <FilterSidebar />
            </Suspense>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Suspense
              key={JSON.stringify(params)}
              fallback={<VehicleGridSkeleton count={12} />}
            >
              <VehiclesGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
