"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SORT_OPTIONS } from "@/constants/vehicles";

export function SortSelect({ currentSort }: { currentSort: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort"
        className="text-[0.72rem] uppercase tracking-[0.08em] text-(--dim) whitespace-nowrap"
      >
        Trier par
      </label>
      <select
        id="sort"
        name="sortBy"
        value={currentSort}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          params.set("sortBy", e.target.value);
          params.delete("page");
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="bg-(--bg-3) border border-(--border) rounded-(--r) px-3 py-2 text-[0.82rem] text-(--text) outline-none focus:border-(--gold) cursor-pointer [&>option]:bg-(--bg-2)"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
