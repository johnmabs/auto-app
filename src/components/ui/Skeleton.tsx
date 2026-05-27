import { cn } from "@/lib/utils";

/* ── Base skeleton ───────────────────────────────────────── */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton rounded-(--r)", className)} {...props} />;
}

/* ── Vehicle Card Skeleton ───────────────────────────────── */
function VehicleCardSkeleton() {
  return (
    <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) overflow-hidden">
      {/* Image */}
      <Skeleton className="h-50 rounded-none" />

      {/* Body */}
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-24" />

        {/* Specs */}
        <div className="flex gap-4 py-3 border-t border-b border-(--border)">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-12" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-2 w-10" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-12" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1">
            <Skeleton className="h-2 w-12" />
            <Skeleton className="h-7 w-28" />
          </div>
          <Skeleton className="h-8 w-20 rounded-(--r)" />
        </div>
      </div>
    </div>
  );
}

/* ── Vehicle Grid Skeleton ───────────────────────────────── */
function VehicleGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Vehicle Detail Skeleton ─────────────────────────────── */
function VehicleDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 p-8">
      {/* Gallery */}
      <div>
        <Skeleton className="h-105 w-full rounded-(--r-lg)" />
        <div className="flex gap-3 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-13.75 w-20 rounded-(--r)" />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-7 space-y-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-3 w-36" />
        <div className="bg-(--bg-3) rounded-(--r-lg) p-5">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-3 w-48 mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-(--r)" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-(--r)" />
        <Skeleton className="h-12 w-full rounded-(--r)" />
      </div>
    </div>
  );
}

/* ── Dashboard KPI Skeleton ──────────────────────────────── */
function DashboardKPISkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-6"
        >
          <div className="flex justify-between mb-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-7 rounded-(--r)" />
          </div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

/* ── Table Row Skeleton ──────────────────────────────────── */
function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-t border-(--border)">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className={`h-4 ${i === 0 ? "w-32" : "w-20"}`} />
        </td>
      ))}
    </tr>
  );
}

function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </tbody>
  );
}

/* ── Catalogue sidebar skeleton ──────────────────────────── */
function FilterSidebarSkeleton() {
  return (
    <div className="bg-(--bg-2) border border-(--border) rounded-(--r-lg) p-6 space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export {
  Skeleton,
  VehicleCardSkeleton,
  VehicleGridSkeleton,
  VehicleDetailSkeleton,
  DashboardKPISkeleton,
  TableSkeleton,
  FilterSidebarSkeleton,
};
