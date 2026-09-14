"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { products, formatIdr, dailyReturn, type Tier } from "@/lib/mock-data";
import { Sparkline } from "@/components/dashboard/sparkline";
import { cn } from "@/lib/utils";

const categories: Array<{ key: "Semua" | Tier; label: string }> = [
  { key: "Semua", label: "Semua" },
  { key: "Konservatif", label: "Konservatif" },
  { key: "Seimbang", label: "Seimbang" },
  { key: "Agresif", label: "Agresif" },
];

export function MarketList() {
  const [active, setActive] = useState<"Semua" | Tier>("Semua");

  const counts = useMemo(() => {
    const map: Record<string, number> = { Semua: products.length };
    for (const p of products) map[p.tier] = (map[p.tier] ?? 0) + 1;
    return map;
  }, []);

  const rows = active === "Semua" ? products : products.filter((p) => p.tier === active);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {categories.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {label} <span className="opacity-70">{counts[key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
        <span>Instrumen</span>
        <span>Harga / Profit</span>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {rows.map((p) => {
          const up = true;
          return (
            <div key={p.id} className="flex items-center gap-2.5 px-3 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {p.name.replace("Genius ", "").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  EA · {p.durationDays} hari · {p.tier}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold">{formatIdr(p.price)}</p>
                <p className={up ? "text-xs font-semibold text-emerald-500" : "text-xs font-semibold text-destructive"}>
                  +{p.returnPct}% · +{formatIdr(dailyReturn(p))}
                </p>
              </div>
              <Sparkline data={p.spark} up={up} className="hidden sm:block" />
              <Star className="size-4 shrink-0 text-muted-foreground/50" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
