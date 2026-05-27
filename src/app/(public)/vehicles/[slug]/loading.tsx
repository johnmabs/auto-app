import { VehicleDetailSkeleton } from "@/components/ui/Skeleton";

export default function VehicleDetailLoading() {
  return (
    <div className="pt-(--nav-h)">
      <div className="bg-(--bg-2) border-b border-(--border) px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-3 w-64" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <VehicleDetailSkeleton />
      </div>
    </div>
  );
}
