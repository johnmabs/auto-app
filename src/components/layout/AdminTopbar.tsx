"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Breadcrumb builder ──────────────────────────────────── */
const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  vehicules: "Véhicules",
  nouveau: "Nouveau",
  demandes: "Demandes",
  commandes: "Commandes",
  contenu: "Contenu",
  temoignages: "Témoignages",
  faq: "FAQ",
  utilisateurs: "Utilisateurs",
  parametres: "Paramètres",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = SEGMENT_LABELS[seg] ?? (seg.length === 25 ? "Détail" : seg);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });
}

/* ── Notification dot ────────────────────────────────────── */
function NotificationBell() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative h-9 w-9 flex items-center justify-center rounded-(--r)",
          "border border-(--border) text-(--muted)",
          "hover:text-(--text) hover:border-(--border-2) transition-all",
        )}
        aria-label="Notifications (12 non lues)"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {/* Badge */}
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-(--accent) flex items-center justify-center text-[0.55rem] font-bold text-white">
          12
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 w-80 z-40 bg-(--bg-2) border border-(--border-2) rounded-(--r-lg) shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
              <span className="text-[0.82rem] font-medium">Notifications</span>
              <span className="text-[0.68rem] text-(--gold)">12 nouvelles</span>
            </div>

            <ul
              className="max-h-72 overflow-y-auto divide-y divide-(--border)"
              role="list"
            >
              {[
                {
                  msg: "Nouvelle demande de Moussa Keita",
                  time: "Il y a 5 min",
                  type: "request",
                },
                {
                  msg: "Véhicule Toyota vendu — #ORD-2501",
                  time: "Il y a 1h",
                  type: "sale",
                },
                {
                  msg: "Nouveau témoignage en attente",
                  time: "Il y a 2h",
                  type: "content",
                },
                {
                  msg: "Demande de Fatou Diallo (BMW X7)",
                  time: "Il y a 3h",
                  type: "request",
                },
                {
                  msg: "Stock faible : BYD Tang EV",
                  time: "Il y a 4h",
                  type: "stock",
                },
              ].map((n, i) => (
                <li key={i} role="listitem">
                  <button
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-(--bg-3) transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <span
                      className={cn(
                        "mt-1 shrink-0 w-2 h-2 rounded-full",
                        n.type === "request" && "bg-(--accent)",
                        n.type === "sale" && "bg-(--green)",
                        n.type === "content" && "bg-(--gold)",
                        n.type === "stock" && "bg-(--blue)",
                      )}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.8rem] text-(--text) leading-snug">
                        {n.msg}
                      </p>
                      <p className="text-[0.68rem] text-(--dim) mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="px-4 py-2.5 border-t border-(--border)">
              <button
                onClick={() => setOpen(false)}
                className="text-[0.75rem] text-(--gold) hover:underline w-full text-center"
              >
                Voir toutes les notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── AdminTopbar ─────────────────────────────────────────── */
interface AdminTopbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  mobileMenuOpen?: boolean;
  onMenuClick?: () => void;
}

export function AdminTopbar({
  user,
  mobileMenuOpen = false,
  onMenuClick,
}: AdminTopbarProps) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header
      className="sticky top-0 z-30 h-(--nav-h) flex items-center gap-4 px-6 lg:px-8 bg-(--bg) border-b border-(--border) shrink-0"
      role="banner"
      aria-label="Barre de navigation admin"
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden h-9 w-9 flex items-center justify-center rounded-(--r) border border-(--border) text-(--muted) hover:text-(--text) hover:border-(--border-2) transition-all shrink-0"
        aria-label="Ouvrir le menu administrateur"
        aria-controls="admin-sidebar"
        aria-expanded={mobileMenuOpen}
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Breadcrumbs */}
      <nav className="flex-1 min-w-0" aria-label="Fil d'Ariane">
        <ol className="flex items-center gap-1.5 text-[0.78rem] truncate">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && (
                <span className="text-(--dim)" aria-hidden="true">
                  /
                </span>
              )}
              {crumb.isLast ? (
                <span
                  className="font-medium text-(--text) truncate"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-(--muted) hover:text-(--gold) transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick add vehicle */}
        <Link
          href="/admin/vehicles/new"
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-(--r) bg-(--gold) text-(--bg) text-[0.75rem] font-semibold uppercase tracking-wider hover:bg-(--gold-2) transition-colors"
          aria-label="Ajouter un nouveau véhicule"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Véhicule
        </Link>

        {/* Notifications */}
        <NotificationBell />

        {/* Profile */}
        <div
          className="flex items-center gap-2.5 pl-2 border-l border-(--border)"
          aria-label={`Connecté en tant que ${user?.name ?? "Admin"}`}
        >
          <div
            className="h-8 w-8 rounded-full bg-(--gold) flex items-center justify-center text-(--bg) text-[0.75rem] font-bold shrink-0"
            aria-hidden="true"
          >
            {user?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-[0.78rem] font-medium leading-none">
              {user?.name ?? "Admin"}
            </p>
            <p className="text-[0.65rem] text-(--dim) mt-0.5">
              {user?.role ?? "ADMIN"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
