import type {
  User,
  CustomerRequest,
  RequestStatus,
  UserRole,
  Country,
} from "@/lib/generated/prisma/client";

// ─── Dashboard stats ───────────────────────────────────────

export interface DashboardStats {
  revenue: number;
  revenueChange: number; // % vs mois précédent
  vehiclesSold: number;
  vehiclesSoldChange: number;
  requests: number;
  requestsChange: number;
  inTransit: number;
  inTransitChange: number;
  available: number;
}

export interface SalesByMonth {
  month: string;
  revenue: number;
  count: number;
}

export interface VehiclesByCountry {
  country: Country;
  count: number;
  percentage: number;
}

// ─── Request avec relations ────────────────────────────────

export type RequestWithRelations = CustomerRequest & {
  vehicle?: {
    id: string;
    make: string;
    model: string;
    slug: string;
  } | null;
  assignee?: Pick<User, "id" | "name" | "email"> | null;
};

// ─── User admin ────────────────────────────────────────────

export type AdminUser = Pick<
  User,
  | "id"
  | "name"
  | "email"
  | "role"
  | "isActive"
  | "createdAt"
  | "lastLoginAt"
  | "image"
>;

// ─── Re-exports ────────────────────────────────────────────

export type { RequestStatus, UserRole, User };
