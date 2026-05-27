"use client";

import * as React from "react";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";

interface AdminUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  image?: string | null;
}

interface AdminShellProps {
  children: React.ReactNode;
  user: AdminUser;
  logoutAction: () => Promise<void>;
}

export function AdminShell({ children, user, logoutAction }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-(--bg) flex">
      <AdminSidebar
        user={user}
        logoutAction={logoutAction}
        mobileOpen={drawerOpen}
        onMobileClose={() => setDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-(--sidebar-w)">
        <AdminTopbar
          user={user}
          mobileMenuOpen={drawerOpen}
          onMenuClick={() => setDrawerOpen(true)}
        />

        <main
          id="admin-main-content"
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
