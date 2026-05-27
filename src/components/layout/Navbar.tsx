"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { COMPANY_INFO } from "@/constants/company";

/* ── Nav links ───────────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/catalog", label: "Catalogue" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

/* ── Navbar ──────────────────────────────────────────────── */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenu, setMobileMenu] = React.useState<{
    open: boolean;
    pathname: string;
  }>({ open: false, pathname });
  const mobileOpen = mobileMenu.open && mobileMenu.pathname === pathname;

  /* Scroll detection */
  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Bloquer le scroll body quand mobile ouvert */
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  const closeMobileMenu = () => {
    setMobileMenu({ open: false, pathname });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-(--nav-h)",
          "flex items-center",
          "border-b transition-all duration-300",
          scrolled
            ? "bg-(--bg)/95 border-(--border) backdrop-blur-xl"
            : "bg-transparent border-transparent",
        )}
        role="banner"
      >
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div>
              <Logo />
            </div>

            <div className="flex items-center gap-8">
              {/* Desktop nav */}
              <nav
                className="hidden lg:flex items-center gap-8 mr-12"
                aria-label="Navigation principale"
              >
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-[0.78rem] font-medium uppercase tracking-[0.08em]",
                        "transition-colors duration-150",
                        "relative after:absolute after:-bottom-0.5 after:left-0 after:right-0",
                        "after:h-px after:bg-(--gold) after:scale-x-0",
                        "after:transition-transform after:duration-200",
                        "hover:text-(--gold) hover:after:scale-x-100",
                        active
                          ? "text-(--gold) after:scale-x-100"
                          : "text-(--muted)",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Right actions */}
              <div className="hidden lg:flex items-center gap-3 ml-auto">
		<a href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/\D/g, "")}?text=Bonjour+Autostore+!+Je+souhaite+des+informations.`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-(--r)",
              "bg-[#25D366] text-white text-[0.8rem] font-medium uppercase tracking-wider",
              "hover:bg-[#1ebe5c] transition-colors",
            )}
          >
            Ouvrir WhatsApp
          </a>
              </div>

              {/* Mobile hamburger */}
              <button
                className={cn(
                  "lg:hidden ml-auto",
                  "h-9 w-9 flex items-center justify-center",
                  "rounded-(--r) border border-(--border)",
                  "text-(--muted) hover:text-(--text) hover:border-(--border-2)",
                  "transition-all",
                )}
                onClick={() => setMobileMenu({ open: !mobileOpen, pathname })}
                aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          "flex flex-col pt-(--nav-h)",
          "bg-(--bg) border-r border-(--border)",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col p-6 gap-1" aria-label="Navigation mobile">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-(--r)",
                  "text-[0.9rem] font-medium uppercase tracking-[0.06em]",
                  "transition-all duration-150",
                  active
                    ? "bg-[rgba(201,168,76,0.1)] text-(--gold)"
                    : "text-(--muted) hover:bg-(--bg-3) hover:text-(--text)",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-(--gold)" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-6 border-t border-(--border) space-y-3">
          <a href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/\D/g, "")}?text=Bonjour+Autostore+!+Je+souhaite+des+informations.`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-(--r)",
              "bg-[#25D366] text-white text-[0.8rem] font-medium uppercase tracking-wider",
              "hover:bg-[#1ebe5c] transition-colors",
            )}
          >
            Ouvrir WhatsApp
          </a>
        </div>
      </div>

      {/* Backdrop mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/50 backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
