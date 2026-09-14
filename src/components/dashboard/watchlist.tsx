"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { products, formatIdr } from "@/lib/mock-data";
import { Sparkline } from "@/components/dashboard/sparkline";
import { cn } from "@/lib/utils";

export function Watchlist() {
  const rows = products.slice(0, 5);
  const [starred, setStarred] = useState<Record<string, boolean>>({
    [rows[0].id]: true,
    [rows[1].id]: true,
  });

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight">Daftar Pantauan</h2>
        <Link href="/dashboard/market" className="text-xs font-semibold text-primary">
          Ubah
        </Link>
      </div>
      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {rows.map((p) => {
          const up = true;
          return (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                aria-label="Tandai favorit"
                onClick={() =>
                  setStarred((s) => ({ ...s, [p.id]: !s[p.id] }))
                }
                className="text-muted-foreground/50"
              >
                <Star
                  className={cn("size-4", starred[p.id] && "fill-accent text-accent")}
                />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.asset} · {p.durationDays} hari
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatIdr(p.price)}</p>
                <p className={up ? "text-xs font-semibold text-emerald-500" : "text-xs font-semibold text-destructive"}>
                  +{p.returnPct}%
                </p>
              </div>
              <Sparkline data={p.spark} up={up} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
