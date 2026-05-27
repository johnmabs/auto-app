import { getVehicles } from "@/actions/vehicle.actions";
import { VehicleCard } from "@/components/vehicles/VehicleCard";

/* ── Featured Vehicles (async) ───────────────────────────── */
export default async function FeaturedVehicles() {
  const { vehicles } = await getVehicles({
    limit: 3,
    featuredOnly: true,
    status: ["AVAILABLE"],
  });

  if (vehicles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </div>
  );
}
