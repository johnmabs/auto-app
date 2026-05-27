import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Download, Eye, Pencil } from "lucide-react";

import db from "@/lib/db";
import { formatPrice, formatMileage, formatDate, cn } from "@/lib/utils";
import { getCountryFlag } from "@/constants/countries";
import { TableSkeleton } from "@/components/ui/Skeleton";
import DeleteVehicleButton from "./DeleteVehicleButton";

export const metadata: Metadata = { title: "Véhicules" };

/* ── Status pill ─────────────────────────────────────────── */
function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    AVAILABLE: {
      label: "Disponible",
      cls: "bg-[rgba(46,204,113,0.1)]  text-[var(--green)]  border-[rgba(46,204,113,0.3)]",
    },
    TRANSIT: {
      label: "En transit",
      cls: "bg-[rgba(52,152,219,0.1)]  text-[var(--blue)]   border-[rgba(52,152,219,0.3)]",
    },
    RESERVED: {
      label: "Réservé",
      cls: "bg-[rgba(201,168,76,0.1)] text-[var(--gold)]   border-[rgba(201,168,76,0.3)]",
    },
    SOLD: {
      label: "Vendu",
      cls: "bg-[rgba(90,88,102,0.2)]  text-[var(--muted)]  border-[var(--border)]",
    },
    DRAFT: {
      label: "Brouillon",
      cls: "bg-[rgba(90,88,102,0.2)]  text-[var(--dim)]    border-[var(--border)]",
    },
  };
  const s = map[status] ?? map["DRAFT"]!;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold border",
        s.cls,
      )}
    >
      {s.label}
    </span>
  );
}

/* ── Vehicles table (async) ──────────────────────────────── */
async function VehiclesTable({
  search,
  status,
  page,
}: {
  search?: string;
  status?: string;
  page: number;
}) {
  const limit = 15;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { make: { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const [vehicles, total] = await Promise.all([
    db.vehicle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { requests: true } },
      },
    }),
    db.vehicle.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse"
          role="table"
          aria-label="Liste des véhicules"
        >
          <thead>
            <tr className="bg-(--bg-3) border-b border-(--border)">
              {[
                "Photo",
                "Véhicule",
                "Année",
                "Prix",
                "Km",
                "Pays",
                "Statut",
                "Demandes",
                "Ajouté",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[0.66rem] font-medium uppercase tracking-widest text-(--dim) whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="py-16 text-center text-(--muted) text-sm"
                >
                  Aucun véhicule trouvé
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="border-t border-(--border) hover:bg-(--bg-3) transition-colors group"
                >
                  {/* Photo */}
                  <td className="px-4 py-3">
                    <div className="w-14 h-10 rounded-(--r) bg-(--bg-4) border border-(--border) flex items-center justify-center text-xl overflow-hidden relative">
                      {v.images[0] ? (
                        <Image
                          src={v.images[0].url}
                          alt="Photo du véhicule"
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <Image
                          src="/images/placeholders/vehicle-placeholder.jpg"
                          alt="Véhicule sans photo"
                          fill
                          className="object-cover object-left"
                          sizes="56px"
                        />
                      )}
                    </div>
                  </td>

                  {/* Véhicule */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-[0.85rem] whitespace-nowrap">
                      {v.make} {v.model}
                    </p>
                    {v.variant && (
                      <p className="text-[0.72rem] text-(--dim)">{v.variant}</p>
                    )}
                  </td>

                  {/* Année */}
                  <td className="px-4 py-3 font-mono text-[0.82rem] text-(--muted)">
                    {v.year}
                  </td>

                  {/* Prix */}
                  <td className="px-4 py-3 font-mono text-[0.85rem] text-(--gold) whitespace-nowrap">
                    {formatPrice(v.price)}
                  </td>

                  {/* Km */}
                  <td className="px-4 py-3 font-mono text-[0.78rem] text-(--muted) whitespace-nowrap">
                    {formatMileage(v.mileage)}
                  </td>

                  {/* Pays */}
                  <td className="px-4 py-3 text-[0.82rem]">
                    {getCountryFlag(v.originCountry)} {v.originCountry}
                  </td>

                  {/* Statut */}
                  <td className="px-4 py-3">
                    <StatusPill status={v.status} />
                  </td>

                  {/* Demandes */}
                  <td className="px-4 py-3 text-center font-mono text-[0.82rem]">
                    {v._count.requests > 0 ? (
                      <span className="text-(--gold)">{v._count.requests}</span>
                    ) : (
                      <span className="text-(--dim)">0</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-[0.75rem] text-(--dim) whitespace-nowrap">
                    {formatDate(v.createdAt, "short")}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/vehicules/${v.slug}`}
                        target="_blank"
                        className="h-7 w-7 flex items-center justify-center rounded-(--r) border border-(--border) text-(--muted) hover:text-(--text) hover:border-(--border-2) transition-all"
                        aria-label="Voir la fiche publique"
                        title="Voir"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/vehicules/${v.id}/edit`}
                        className="h-7 w-7 flex items-center justify-center rounded-(--r) border border-(--border) text-(--muted) hover:text-(--gold) hover:border-(--gold) transition-all"
                        aria-label={`Modifier ${v.make} ${v.model}`}
                        title="Modifier"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <DeleteVehicleButton
                        id={v.id}
                        label={`${v.make} ${v.model}`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-(--border)">
          <p className="text-[0.78rem] text-(--muted)">
            {total} véhicule{total !== 1 ? "s" : ""} · Page {page} sur{" "}
            {totalPages}
          </p>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const p = i + 1;
              return (
                <Link
                  key={p}
                  href={`/admin/vehicules?page=${p}`}
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-(--r) text-[0.78rem] border transition-all",
                    p === page
                      ? "bg-(--gold) text-(--bg) border-(--gold)"
                      : "border-(--border) text-(--muted) hover:border-(--border-2)",
                  )}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Stats bar ───────────────────────────────────────────── */
async function VehicleStats() {
  const [total, available, transit, sold, draft] = await Promise.all([
    db.vehicle.count(),
    db.vehicle.count({ where: { status: "AVAILABLE" } }),
    db.vehicle.count({ where: { status: "TRANSIT" } }),
    db.vehicle.count({ where: { status: "SOLD" } }),
    db.vehicle.count({ where: { status: "DRAFT" } }),
  ]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {[
        { label: "Total", value: total, color: "text-[var(--text)]" },
        {
          label: "Disponibles",
          value: available,
          color: "text-[var(--green)]",
        },
        { label: "En transit", value: transit, color: "text-[var(--blue)]" },
        { label: "Vendus", value: sold, color: "text-[var(--muted)]" },
        { label: "Brouillons", value: draft, color: "text-[var(--dim)]" },
      ].map((s) => (
        <div
          key={s.label}
          className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) px-4 py-3"
        >
          <p className={cn("font-display text-2xl tracking-wide", s.color)}>
            {s.value}
          </p>
          <p className="text-[0.7rem] uppercase tracking-[0.08em] text-(--dim) mt-0.5">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default async function AdminVehiculesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const STATUS_FILTERS = [
    { value: "all", label: "Tous" },
    { value: "AVAILABLE", label: "Disponibles" },
    { value: "TRANSIT", label: "En transit" },
    { value: "RESERVED", label: "Réservés" },
    { value: "SOLD", label: "Vendus" },
    { value: "DRAFT", label: "Brouillons" },
  ];

  return (
    <div className="space-y-6 max-w-350">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-[2.2rem] tracking-[0.04em]">
            VÉHICULES
          </h1>
          <p className="text-[0.82rem] text-(--muted) mt-1">
            Gestion complète du catalogue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 h-9 px-4 rounded-(--r) border border-(--border) text-(--muted) text-[0.78rem] hover:border-(--border-2) transition-all">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Exporter CSV
          </button>
          <Link
            href="/admin/vehicules/nouveau"
            className="inline-flex items-center gap-2 h-9 px-5 rounded-(--r) bg-(--gold) text-(--bg) text-[0.8rem] font-semibold uppercase tracking-wider hover:bg-(--gold-2) transition-colors"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Ajouter
          </Link>
        </div>
      </div>

      {/* Stats */}
      <Suspense
        fallback={
          <div className="grid grid-cols-5 gap-3 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 skeleton rounded-(--r-lg)" />
            ))}
          </div>
        }
      >
        <VehicleStats />
      </Suspense>

      {/* Table card */}
      <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) overflow-hidden">
        {/* Filters bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-(--border) flex-wrap">
          {/* Search */}
          <form method="GET" className="relative flex-1 min-w-50 max-w-xs">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--dim) text-sm"
              aria-hidden="true"
            >
              🔍
            </span>
            <input
              name="search"
              defaultValue={params.search}
              placeholder="Marque, modèle..."
              className="w-full pl-9 pr-4 py-2 text-[0.82rem] bg-(--bg-3) border border-(--border) rounded-(--r) text-(--text) placeholder:text-(--dim) outline-none focus:border-(--gold) transition-colors"
            />
          </form>

          {/* Status filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <Link
                key={f.value}
                href={`/admin/vehicules?status=${f.value}`}
                className={cn(
                  "h-8 px-3 flex items-center text-[0.75rem] rounded-(--r) border transition-all",
                  (params.status ?? "all") === f.value
                    ? "bg-[rgba(201,168,76,0.1)] border-[rgba(201,168,76,0.3)] text-(--gold)"
                    : "border-(--border) text-(--muted) hover:border-(--border-2) hover:text-(--text)",
                )}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Table */}
        <Suspense
          key={JSON.stringify(params)}
          fallback={
            <table className="w-full">
              <TableSkeleton rows={10} cols={10} />
            </table>
          }
        >
          <VehiclesTable
            search={params.search}
            status={params.status}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  );
}
