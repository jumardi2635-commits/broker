"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Star } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { instruments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const categories = ["Semua", "Forex", "Kripto", "Saham", "Komoditas"] as const;

export default function MarketsPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("Semua");

  const rows =
    active === "Semua"
      ? instruments
      : instruments.filter((it) => it.category === active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Pasar</h1>
        <p className="text-sm text-muted-foreground">
          Harga langsung untuk semua instrumen yang tersedia.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <Panel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Instrumen</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 text-right font-medium">Harga</th>
                <th className="px-5 py-3 text-right font-medium">Perubahan 24j</th>
                <th className="px-5 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((it) => {
                const up = it.change >= 0;
                return (
                  <tr
                    key={it.symbol}
                    className="border-b border-border/60 last:border-0 hover:bg-secondary/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Star className="size-4 text-muted-foreground/50" />
                        <div>
                          <p className="font-semibold">{it.symbol}</p>
                          <p className="text-xs text-muted-foreground">{it.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{it.category}</td>
                    <td className="px-5 py-3 text-right font-semibold">{it.price}</td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 font-medium",
                          up ? "text-emerald-500" : "text-destructive",
                        )}
                      >
                        {up ? (
                          <ArrowUpRight className="size-3.5" />
                        ) : (
                          <ArrowDownRight className="size-3.5" />
                        )}
                        {Math.abs(it.change)}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-strong"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
