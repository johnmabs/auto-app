import { getVehicles } from "@/actions/vehicle.actions";
import { VehicleCard } from "@/components/vehicles/VehicleCard";

/* ── Recent Vehicles (async) ─────────────────────────────── */
export default async function RecentVehicles() {
  const { vehicles } = await getVehicles({
    limit: 6,
    status: ["AVAILABLE", "TRANSIT"],
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  /*  if (vehicles.length === 0) return null; */

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {vehicles.map((vehicle, i) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 3} />
      ))}
    </div>
  );
}
