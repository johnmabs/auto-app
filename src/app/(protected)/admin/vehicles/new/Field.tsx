/* ── Field wrapper ───────────────────────────────────────── */
export default function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-[0.68rem] uppercase tracking-widest text-(--dim) mb-1.5 font-medium">
        {label}
        {required && <span className="text-(--accent) ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[0.68rem] text-(--dim) mt-1">{hint}</p>}
    </div>
  );
}
