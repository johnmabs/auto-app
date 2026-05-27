export default function GlobalLoading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--bg)"
      aria-label="Chargement en cours"
      role="status"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full bg-(--accent) animate-pulse"
            aria-hidden="true"
          />
          <span className="font-display text-[1.8rem] tracking-[0.08em] text-(--gold) animate-pulse">
            AUTOSTORE
          </span>
        </div>
        {/* Progress bar */}
        <div
          className="w-40 h-0.5 bg-(--border) rounded-full overflow-hidden"
          aria-hidden="true"
        >
          <div className="h-full bg-(--gold) animate-[shimmer_1.5s_infinite] w-1/2" />
        </div>
        <span className="sr-only">Chargement…</span>
      </div>
    </div>
  );
}
