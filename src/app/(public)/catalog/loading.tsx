import {
  VehicleGridSkeleton,
  FilterSidebarSkeleton,
} from "@/components/ui/Skeleton";

export default function CatalogueLoading() {
  return (
    <div className="pt-(--nav-h)">
      {/* Header skeleton */}
      <div className="bg-(--bg-2) border-b border-(--border) px-6 lg:px-10 py-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-10 w-64" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex gap-8 items-start">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-65 shrink-0">
            <FilterSidebarSkeleton />
          </div>

          {/* Grid skeleton */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-9 w-36 rounded-(--r)" />
            </div>
            <VehicleGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
