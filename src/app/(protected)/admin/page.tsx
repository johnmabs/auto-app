import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Car,
  Inbox,
  Package,
  Users,
  ArrowRight,
} from "lucide-react";

import { DashboardKPISkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import db from "@/lib/db";
import { formatPrice, formatDate, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

/* ── KPI Card ────────────────────────────────────────────── */
function KPICard({
  label,
  value,
  change,
  positive,
  icon,
  href,
  color = "gold",
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  href?: string;
  color?: "gold" | "green" | "blue" | "accent";
}) {
  const iconColors = {
    gold: "bg-[rgba(201,168,76,0.1)]  text-[var(--gold)]",
    green: "bg-[rgba(46,204,113,0.1)]  text-[var(--green)]",
    blue: "bg-[rgba(52,152,219,0.1)]  text-[var(--blue)]",
    accent: "bg-[rgba(230,57,70,0.1)]   text-[var(--accent)]",
  };

  const card = (
    <div
      className={cn(
        "bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--r-lg)] p-6",
        href && "hover:border-[var(--border-2)] transition-all cursor-pointer",
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
          {label}
        </p>
        <div
          className={cn(
            "w-9 h-9 rounded-[var(--r)] flex items-center justify-center text-sm",
            iconColors[color],
          )}
        >
          {icon}
        </div>
      </div>

      <p className="font-display text-[2.4rem] tracking-[0.03em] leading-none mb-2">
        {value}
      </p>

      <div
        className={cn(
          "flex items-center gap-1.5 text-[0.75rem] font-medium",
          positive ? "text-[var(--green)]" : "text-[var(--accent)]",
        )}
      >
        {positive ? (
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {change}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  }
  return card;
}

/* ── Bar chart (pure CSS) ────────────────────────────────── */
function BarChart({
  data,
}: {
  data: { label: string; value: number; current?: boolean }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className="flex items-end gap-2 h-36"
      role="img"
      aria-label="Graphique des ventes mensuelles"
    >
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
          <div
            className={cn(
              "w-full rounded-t-sm transition-all duration-500",
              d.current
                ? "bg-[var(--gold)]"
                : d.value > 0
                  ? "bg-[rgba(201,168,76,0.35)]"
                  : "bg-[var(--bg-3)]",
            )}
            style={{
              height: `${(d.value / max) * 100}%`,
              minHeight: d.value > 0 ? "4px" : "0",
            }}
          />
          <span
            className={cn(
              "text-[0.62rem] font-mono whitespace-nowrap",
              d.current ? "text-[var(--gold)]" : "text-[var(--dim)]",
            )}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut chart (SVG) ───────────────────────────────────── */
function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const circumference = 2 * Math.PI * 50; // r=50

  const { slices } = data.reduce<{
    offset: number;
    slices: ((typeof data)[number] & {
      dash: number;
      offset: number;
      pct: number;
    })[];
  }>(
    (acc, d) => {
      const pct = total > 0 ? d.value / total : 0;
      const dash = pct * circumference;

      return {
        offset: acc.offset + dash,
        slices: [...acc.slices, { ...d, dash, offset: acc.offset, pct }],
      };
    },
    { offset: 0, slices: [] },
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg
          viewBox="0 0 120 120"
          width="140"
          height="140"
          role="img"
          aria-label="Répartition par pays d'importation"
        >
          {slices.map((s, i) => (
            <circle
              key={i}
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={-s.offset}
              transform="rotate(-90 60 60)"
            />
          ))}
          {/* Center hole */}
          <circle cx="60" cy="60" r="40" fill="var(--bg-2)" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[1.8rem] text-[var(--gold)]">
            {total}
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.08em] text-[var(--dim)]">
            Total
          </span>
        </div>
      </div>

      <ul className="w-full space-y-1.5">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-[0.75rem]">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: s.color }}
              aria-hidden="true"
            />
            <span className="flex-1 text-[var(--muted)]">{s.label}</span>
            <span className="font-mono text-[var(--dim)]">
              {Math.round(s.pct * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Request row ─────────────────────────────────────────── */
function RequestRow({
  firstName,
  lastName,
  phone,
  desiredModel,
  budget,
  status,
  createdAt,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  desiredModel?: string | null;
  budget?: number | null;
  status: string;
  createdAt: Date;
  country?: string | null;
}) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    NEW: {
      label: "Nouvelle",
      className:
        "bg-[rgba(230,57,70,0.1)]  text-[var(--accent)]  border-[rgba(230,57,70,0.3)]",
    },
    CONTACTED: {
      label: "Contacté",
      className:
        "bg-[rgba(201,168,76,0.1)] text-[var(--gold)]   border-[rgba(201,168,76,0.3)]",
    },
    IN_PROGRESS: {
      label: "En cours",
      className:
        "bg-[rgba(52,152,219,0.1)] text-[var(--blue)]   border-[rgba(52,152,219,0.3)]",
    },
    QUOTE_SENT: {
      label: "Devis env.",
      className:
        "bg-[rgba(201,168,76,0.1)] text-[var(--gold)]   border-[rgba(201,168,76,0.3)]",
    },
    CONFIRMED: {
      label: "Confirmée",
      className:
        "bg-[rgba(46,204,113,0.1)] text-[var(--green)]  border-[rgba(46,204,113,0.3)]",
    },
    DELIVERED: {
      label: "Livrée",
      className:
        "bg-[rgba(46,204,113,0.1)] text-[var(--green)]  border-[rgba(46,204,113,0.3)]",
    },
    CANCELLED: {
      label: "Annulée",
      className:
        "bg-[rgba(90,88,102,0.2)]  text-[var(--muted)]  border-[var(--border)]",
    },
  };

  const s = statusConfig[status] ?? statusConfig["NEW"]!;

  return (
    <tr className="border-t border-[var(--border)] hover:bg-[var(--bg-3)] transition-colors">
      <td className="px-5 py-4">
        <p className="text-[0.85rem] font-medium">
          {firstName} {lastName}
        </p>
        <p className="text-[0.72rem] text-[var(--dim)] font-mono mt-0.5">
          {phone}
        </p>
      </td>
      <td className="px-5 py-4 text-[0.82rem] text-[var(--muted)]">
        {desiredModel ?? "Demande générale"}
      </td>
      <td className="px-5 py-4 text-[0.82rem] font-mono">
        {budget ? formatPrice(budget) : "—"}
      </td>
      <td className="px-5 py-4">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold border",
            s.className,
          )}
        >
          {s.label}
        </span>
      </td>
      <td className="px-5 py-4 text-[0.78rem] text-[var(--dim)]">
        {formatDate(createdAt, "relative")}
      </td>
    </tr>
  );
}

/* ── Data fetching ───────────────────────────────────────── */
async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrev = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    vehicleCount,
    availableCount,
    transitCount,
    requestCount,
    newRequestCount,
    recentRequests,
    soldThisMonth,
    soldLastMonth,
    requestsThisMonth,
    requestsLastMonth,
    countryStats,
    soldThisYear,
  ] = await Promise.all([
    db.vehicle.count(),
    db.vehicle.count({ where: { status: "AVAILABLE" } }),
    db.vehicle.count({ where: { status: "TRANSIT" } }),
    db.customerRequest.count(),
    db.customerRequest.count({ where: { status: "NEW" } }),
    db.customerRequest.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        country: true,
        desiredModel: true,
        budget: true,
        status: true,
        createdAt: true,
      },
    }),
    db.vehicle.count({
      where: { status: "SOLD", updatedAt: { gte: startOfMonth } },
    }),
    db.vehicle.count({
      where: {
        status: "SOLD",
        updatedAt: { gte: startOfPrev, lte: endOfPrev },
      },
    }),
    db.customerRequest.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.customerRequest.count({
      where: { createdAt: { gte: startOfPrev, lte: endOfPrev } },
    }),
    db.vehicle.groupBy({
      by: ["originCountry"],
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    db.vehicle.findMany({
      where: {
        status: "SOLD",
        updatedAt: { gte: startOfYear },
      },
      select: {
        updatedAt: true,
      },
    }),
  ]);

  const soldChange =
    soldLastMonth > 0
      ? ((soldThisMonth - soldLastMonth) / soldLastMonth) * 100
      : 0;
  const requestChange =
    requestsLastMonth > 0
      ? ((requestsThisMonth - requestsLastMonth) / requestsLastMonth) * 100
      : 0;

  return {
    vehicleCount,
    availableCount,
    transitCount,
    requestCount,
    newRequestCount,
    recentRequests,
    soldThisMonth,
    soldChange,
    requestsThisMonth,
    requestChange,
    countryStats,
    soldThisYear,
  };
}

/* ── KPIs (async) ────────────────────────────────────────── */
async function DashboardKPIs() {
  const data = await getDashboardData();
  const { soldChange, requestChange } = data;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <KPICard
        label="Véhicules en stock"
        value={String(data.availableCount)}
        change={`${data.vehicleCount} total`}
        positive
        icon={<Car className="h-4 w-4" />}
        href="/admin/vehicules"
        color="gold"
      />
      <KPICard
        label="Vendus ce mois"
        value={String(data.soldThisMonth)}
        change={`${soldChange >= 0 ? "+" : ""}${soldChange.toFixed(0)}% vs mois dernier`}
        positive={soldChange >= 0}
        icon={<Package className="h-4 w-4" />}
        color="green"
      />
      <KPICard
        label="Nouvelles demandes"
        value={String(data.newRequestCount)}
        change={`${data.requestsThisMonth} ce mois`}
        positive={requestChange >= 0}
        icon={<Inbox className="h-4 w-4" />}
        href="/admin/demandes"
        color="accent"
      />
      <KPICard
        label="En transit"
        value={String(data.transitCount)}
        change="Importations en cours"
        positive
        icon={<Users className="h-4 w-4" />}
        color="blue"
      />
    </div>
  );
}

/* ── Charts row (async) ──────────────────────────────────── */
async function ChartsRow() {
  const { countryStats, soldThisYear } = await getDashboardData();

  const MONTHS = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const now = new Date();
  const monthlySales = Array.from({ length: 12 }, () => 0);

  soldThisYear.forEach(({ updatedAt }) => {
    const monthIndex = updatedAt.getMonth();
    monthlySales[monthIndex] = (monthlySales[monthIndex] ?? 0) + 1;
  });

  const salesData = MONTHS.slice(0, now.getMonth() + 1).map((label, i) => ({
    label,
    value: monthlySales[i] ?? 0,
    current: i === now.getMonth(),
  }));

  const countryColors = [
    "var(--gold)",
    "var(--blue)",
    "var(--green)",
    "var(--accent)",
    "var(--muted)",
  ];
  const countryData = countryStats.slice(0, 5).map((c, i) => ({
    label: c.originCountry,
    value: c._count._all,
    color: countryColors[i] ?? "var(--dim)",
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
      {/* Sales chart */}
      <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
        <div className="mb-5">
          <h2 className="font-medium text-[0.9rem]">
            Ventes mensuelles {now.getFullYear()}
          </h2>
          <p className="text-[0.75rem] text-[var(--muted)] mt-0.5">
            Nombre de véhicules vendus par mois
          </p>
        </div>
        <BarChart data={salesData} />
      </div>

      {/* Country donut */}
      <div className="bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
        <div className="mb-5">
          <h2 className="font-medium text-[0.9rem]">
            Par pays d&apos;importation
          </h2>
          <p className="text-[0.75rem] text-[var(--muted)] mt-0.5">
            Distribution du catalogue
          </p>
        </div>
        {countryData.length > 0 ? (
          <DonutChart data={countryData} />
        ) : (
          <div className="flex items-center justify-center h-32 text-[var(--dim)] text-sm">
            Aucune donnée disponible
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Recent requests table (async) ───────────────────────── */
async function RecentRequestsTable() {
  const { recentRequests } = await getDashboardData();

  return (
    <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-(--border)">
        <h2 className="font-medium text-[0.9rem]">Demandes récentes</h2>
        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-1.5 text-[0.75rem] text-(--gold) hover:underline"
        >
          Voir tout <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {recentRequests.length === 0 ? (
        <div className="py-12 text-center text-(--muted) text-sm">
          Aucune demande pour le moment
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" role="table">
            <thead>
              <tr className="bg-(--bg-3)">
                {[
                  "Client",
                  "Véhicule souhaité",
                  "Budget",
                  "Statut",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-widest text-(--dim)"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <RequestRow key={req.id} {...req} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Quick actions ───────────────────────────────────────── */
function QuickActions() {
  const actions = [
    {
      href: "/admin/vehicles/new",
      label: "Ajouter un véhicule",
      icon: "🚗",
      color: "var(--gold)",
    },
    {
      href: "/admin/requests",
      label: "Gérer les demandes",
      icon: "📥",
      color: "var(--accent)",
    },
    {
      href: "/admin/utilisateurs",
      label: "Gérer les utilisateurs",
      icon: "👥",
      color: "var(--green)",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex items-center gap-3 bg-(--bg-2) border border-(--border) rounded-(--r-lg) px-4 py-3.5
                     hover:border-(--border-2) hover:bg-(--bg-3) transition-all"
        >
          <span className="text-xl" aria-hidden="true">
            {action.icon}
          </span>
          <span className="text-[0.8rem] font-medium leading-snug">
            {action.label}
          </span>
          <ArrowRight
            className="h-3.5 w-3.5 text-(--dim) ml-auto shrink-0"
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function DashboardPage() {
  const now = new Date();

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="font-display text-[2.2rem] tracking-[0.04em]">
          DASHBOARD
        </h1>
        <p className="text-[0.82rem] text-[var(--muted)] mt-1">
          Bienvenue —{" "}
          {now.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* KPIs */}
      <Suspense fallback={<DashboardKPISkeleton />}>
        <DashboardKPIs />
      </Suspense>

      {/* Charts */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <div className="h-64 bg-[var(--bg-2)] border border-[var(--border)] rounded-[var(--r-lg)]" />
            <div className="h-64 bg-[var(--bg-2)] border border-(--border) rounded-[var(--r-lg)]" />
          </div>
        }
      >
        <ChartsRow />
      </Suspense>

      {/* Recent requests */}
      <Suspense
        fallback={
          <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) overflow-hidden">
            <div className="px-5 py-4 border-b border-(--border)">
              <div className="skeleton h-4 w-32" />
            </div>
            <table className="w-full">
              <TableSkeleton rows={5} cols={5} />
            </table>
          </div>
        }
      >
        <RecentRequestsTable />
      </Suspense>
    </div>
  );
}
