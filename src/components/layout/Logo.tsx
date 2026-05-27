import Link from "next/link";

/* ── Logo ────────────────────────────────────────────────── */
export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 group"
      aria-label="Autostore Congo — Accueil"
    >
      <span className="font-display text-[1.5rem] tracking-[0.08em] text-(--gold) leading-none">
        <span className="text-(--dim) opacity-60 mx-0.5"></span>
        <span className="text-(--text)">AUTO</span>STORE
      </span>
    </Link>
  );
}
