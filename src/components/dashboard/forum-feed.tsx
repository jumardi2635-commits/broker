"use client";

import { useMemo, useState } from "react";
import { Calendar, CalendarDays, CalendarRange, ChevronDown, LayoutGrid } from "lucide-react";
import { ProofCard } from "@/components/dashboard/proof-card";
import type { WithdrawalProof } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const filters = [
  { key: "semua", label: "Semua", icon: LayoutGrid },
  { key: "hari", label: "Hari Ini", icon: Calendar },
  { key: "minggu", label: "Minggu Ini", icon: CalendarDays },
  { key: "bulan", label: "Bulan Ini", icon: CalendarRange },
] as const;

type FilterKey = (typeof filters)[number]["key"];

export function ForumFeed({ proofs }: { proofs: WithdrawalProof[] }) {
  const [filter, setFilter] = useState<FilterKey>("semua");
  const [sort, setSort] = useState<"Terbaru" | "Terlama">("Terbaru");

  const filtered = useMemo(() => {
    const base =
      filter === "hari"
        ? proofs.filter((p) => p.timeLabel.startsWith("Hari ini"))
        : proofs;
    return sort === "Terlama" ? [...base].reverse() : base;
  }, [proofs, filter, sort]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {filters.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Total Bukti: <span className="font-bold text-foreground">{proofs.length}</span>
        </p>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "Terbaru" | "Terlama")}
            aria-label="Urutkan bukti penarikan"
            className="appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-8 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          >
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          Belum ada bukti untuk filter ini.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((proof) => (
            <ProofCard key={proof.id} proof={proof} />
          ))}
        </div>
      )}
    </div>
  );
}
