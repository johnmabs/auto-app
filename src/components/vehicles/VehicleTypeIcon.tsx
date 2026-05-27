import {
  BusFront,
  Car,
  CarFront,
  Gauge,
  Gem,
  Sun,
  Trophy,
  Truck,
} from "lucide-react";

import type { VehicleTypeIconName } from "@/types";
import { cn } from "@/lib/utils";

const ICONS = {
  car: Car,
  "car-front": CarFront,
  gauge: Gauge,
  truck: Truck,
  "bus-front": BusFront,
  sun: Sun,
  gem: Gem,
  trophy: Trophy,
} satisfies Record<
  VehicleTypeIconName,
  React.ComponentType<{ className?: string }>
>;

export function VehicleTypeIcon({
  name,
  className,
}: {
  name?: VehicleTypeIconName;
  className?: string;
}) {
  if (!name) return null;

  const Icon = ICONS[name];

  return (
    <Icon
      className={cn("h-3.5 w-3.5 shrink-0 text-(--dim)", className)}
      aria-hidden="true"
    />
  );
}
