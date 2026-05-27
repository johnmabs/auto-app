import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center px-6 pt-(--nav-h)"
        aria-label="Page introuvable"
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.04)_0%,transparent_60%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="text-center max-w-lg relative">
          {/* 404 */}
          <p
            className="font-display text-[8rem] lg:text-[12rem] text-(--border-2) leading-none select-none"
            aria-hidden="true"
          >
            404
          </p>

          <div className="-mt-8 relative">
            <h1 className="font-display text-[2rem] tracking-[0.04em] mb-4">
              PAGE INTROUVABLE
            </h1>
            <p className="text-[0.9rem] text-(--muted) leading-relaxed mb-8">
              La page que vous cherchez n&apos;existe pas ou a été déplacée.
              Retournez à l&apos;accueil ou explorez notre catalogue.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-(--gold) text-(--bg) rounded-(--r) text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-(--gold-2) transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="/catalogue"
                className="px-6 py-3 border border-(--border-2) text-(--text) rounded-(--r) text-[0.85rem] font-medium uppercase tracking-wider hover:border-(--gold) hover:text-(--gold) transition-all"
              >
                Catalogue
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border border-(--border-2) text-(--text) rounded-(--r) text-[0.85rem] font-medium uppercase tracking-wider hover:border-(--gold) hover:text-(--gold) transition-all"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
