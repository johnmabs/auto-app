import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { AdminShell } from "@/components/layout/AdminShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — Autostore Admin",
    template: "%s — Autostore Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function logoutAction() {
    "use server";

    await signOut({ redirectTo: "/login" });
  }

  /* ── Auth guard ──────────────────────────────────────── */
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };

  const allowedRoles = ["ADMIN", "SUPER_ADMIN", "EDITOR"];
  if (!user.role || !allowedRoles.includes(user.role)) {
    redirect("/");
  }

  return (
    <AdminShell user={user} logoutAction={logoutAction}>
      {children}
    </AdminShell>
  );
}
