export * from "./vehicle";
export * from "./admin";

// ─── Types utilitaires ─────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export type VehicleTypeIconName =
  | "car"
  | "car-front"
  | "gauge"
  | "truck"
  | "bus-front"
  | "sun"
  | "gem"
  | "trophy";

export type VehicleTypeSelectOption<T = string> = SelectOption<T> & {
  icon?: VehicleTypeIconName;
};

export interface PageParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
