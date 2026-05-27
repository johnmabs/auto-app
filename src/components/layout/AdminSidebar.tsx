"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────── */
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeVariant?: "gold" | "danger" | "muted";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

/* ── Navigation config ───────────────────────────────────── */
const NAV_SECTIONS: NavSection[] = [
  {
    title: "Principal",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        href: "/admin/vehicles",
        label: "Véhicules",
        icon: <Car className="h-4 w-4" />,
        badge: 260,
        badgeVariant: "muted",
      },
    ],
  },
  {
    title: "Gestion",
    items: [
      {
        href: "/admin/utilisateurs",
        label: "Utilisateurs",
        icon: <Users className="h-4 w-4" />,
      },
      {
        href: "/admin/parametres",
        label: "Paramètres",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
];

/* ── Badge ───────────────────────────────────────────────── */
function NavBadge({
  value,
  variant = "muted",
}: {
  value: number | string;
  variant?: "gold" | "danger" | "muted";
}) {
  return (
    <span
      className={cn(
        "ml-auto inline-flex items-center justify-center",
        "h-4 min-w-4 px-1 rounded-full",
        "text-[0.6rem] font-bold leading-none",
        variant === "gold" &&
          "bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)]",
        variant === "danger" &&
          "bg-[rgba(230,57,70,0.15)]  text-(--accent)  border border-[rgba(230,57,70,0.3)]",
        variant === "muted" &&
          "bg-(--bg-4) text-(--muted) border border-(--border)",
      )}
    >
      {value}
    </span>
  );
}

/* ── Sidebar ─────────────────────────────────────────────── */
interface AdminSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  logoutAction: () => Promise<void>;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({
  user,
  logoutAction,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-label="Fermer le menu administrateur"
        />
      )}

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 lg:z-40",
          "flex flex-col",
          "bg-(--bg-2) border-r border-(--border)",
          "transition-all duration-300 ease-in-out",
          "w-[min(20rem,calc(100vw-2rem))] lg:w-(--sidebar-w)",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed && "lg:w-16",
        )}
        aria-label="Navigation administrateur"
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          className={cn(
            "flex items-center h-(--nav-h) shrink-0",
            "border-b border-(--border) px-4",
            "justify-between",
            collapsed && "lg:justify-center",
          )}
        >
          <div className={cn(collapsed && "lg:hidden")}>
            <div className="font-display text-[1.1rem] tracking-[0.08em] bg-(--gold)">
              AUTOSTORE
            </div>
            <div className="text-[0.6rem] uppercase tracking-[0.12em] text-(--dim) bg-(--bg-3) px-2 py-0.5 rounded-full w-fit mt-0.5">
              Admin Panel
            </div>
          </div>

          <div
            className={cn("flex items-center gap-2", collapsed && "lg:mx-auto")}
          >
            {/* Close drawer (mobile only) */}
            <button
              type="button"
              onClick={onMobileClose}
              className="lg:hidden h-8 w-8 flex items-center justify-center rounded-(--r) border border-(--border) text-(--muted) hover:text-(--text) hover:border-(--border-2) transition-all"
              aria-label="Fermer le menu administrateur"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Collapse toggle (desktop only) */}
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className={cn(
                "hidden lg:flex items-center justify-center",
                "h-7 w-7 rounded-(--r) border border-(--border)",
                "text-(--muted) hover:text-(--text) hover:border-(--border-2)",
                "transition-all shrink-0",
              )}
              aria-label={
                collapsed ? "Développer la sidebar" : "Réduire la sidebar"
              }
            >
              {collapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Navigation ─────────────────────────────────── */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-3 space-y-6"
          aria-label="Menu administration"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              {/* Section title */}
              <p
                className={cn(
                  "text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-(--dim) px-3 mb-2",
                  collapsed && "lg:hidden",
                )}
              >
                {section.title}
              </p>

              <ul className="space-y-0.5" role="list">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} role="listitem">
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          "relative flex items-center rounded-(--r)",
                          "text-[0.83rem] font-medium",
                          "transition-all duration-150",
                          "gap-3 px-3 py-2.5",
                          collapsed &&
                            "lg:h-9 lg:w-full lg:justify-center lg:px-0",
                          active
                            ? "bg-(--gold)"
                            : "text-(--muted) hover:bg-(--bg-3) hover:text-(--text)",
                        )}
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                      >
                        {/* Icon */}
                        <span
                          className={cn(
                            "shrink-0 transition-colors",
                            active ? "bg-(--gold)" : "text-(--dim)",
                          )}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>

                        {/* Label + badge */}
                        <span
                          className={cn(
                            "flex-1 truncate",
                            collapsed && "lg:hidden",
                          )}
                        >
                          {item.label}
                        </span>
                        {item.badge !== undefined && (
                          <span className={cn(collapsed && "lg:hidden")}>
                            <NavBadge
                              value={item.badge}
                              variant={item.badgeVariant}
                            />
                          </span>
                        )}

                        {/* Badge only (collapsed) */}
                        {collapsed && item.badge !== undefined && (
                          <span className="hidden lg:block absolute top-1 right-1 h-2 w-2 rounded-full bg-(--accent)" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── Footer ─────────────────────────────────────── */}
        <div className="shrink-0 border-t border-(--border) p-3 space-y-1">
          {/* View site */}
          <Link
            href="/"
            target="_blank"
            onClick={onMobileClose}
            className={cn(
              "flex items-center rounded-(--r)",
              "text-[0.78rem] text-(--muted) hover:text-(--text)",
              "hover:bg-(--bg-3) transition-all",
              "gap-3 px-3 py-2",
              collapsed && "lg:h-9 lg:justify-center lg:px-0",
            )}
            title={collapsed ? "Voir le site" : undefined}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className={cn(collapsed && "lg:hidden")}>Voir le site</span>
          </Link>

          {/* Logout */}
          <form action={logoutAction}>
            <button
              type="submit"
              className={cn(
                "w-full flex items-center rounded-(--r)",
                "text-[0.78rem] text-(--muted) hover:text-(--accent)",
                "hover:bg-[rgba(230,57,70,0.06)] transition-all",
                "gap-3 px-3 py-2",
                collapsed && "lg:h-9 lg:justify-center lg:px-0",
              )}
              title={collapsed ? "Déconnexion" : undefined}
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className={cn(collapsed && "lg:hidden")}>Déconnexion</span>
            </button>
          </form>

          {/* User profile */}
          {user && (
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2 mt-2 rounded-(--r) bg-(--bg-3)",
                collapsed && "lg:hidden",
              )}
            >
              <div className="h-8 w-8 rounded-full bg-(--gold) flex items-center justify-center text-(--bg) text-[0.75rem] font-bold shrink-0">
                {user.name?.charAt(0).toUpperCase() ?? "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.8rem] font-medium truncate">
                  {user.name ?? "Admin"}
                </p>
                <p className="text-[0.65rem] text-(--dim) truncate">
                  {user.role ?? "ADMIN"}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
