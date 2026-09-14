"use client";

import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const mockPositions = [
  {
    id: 1,
    symbol: "EURUSD",
    side: "BUY" as const,
    lots: 1.0,
    entry: "1.0850",
    current: "1.0920",
    pnl: 70,
    pnlPct: 0.65,
  },
  {
    id: 2,
    symbol: "GBPUSD",
    side: "SELL" as const,
    lots: 0.5,
    entry: "1.2750",
    current: "1.2680",
    pnl: 35,
    pnlPct: 0.55,
  },
];

export function DemoPositions() {
  const [positions, setPositions] = useState(mockPositions);

  const closePosition = (id: number) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">Tidak ada posisi terbuka</p>
        <p className="text-xs text-muted-foreground">Buat pesanan untuk memulai trading demo</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="pb-2 font-medium">Instrumen</th>
            <th className="pb-2 font-medium">Arah</th>
            <th className="pb-2 font-medium">Lot</th>
            <th className="pb-2 text-right font-medium">Entri</th>
            <th className="pb-2 text-right font-medium">Saat Ini</th>
            <th className="pb-2 text-right font-medium">P/L</th>
            <th className="pb-2 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => (
            <tr key={p.id} className="border-b border-border/60 last:border-0">
              <td className="py-2.5 font-semibold">{p.symbol}</td>
              <td>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-xs font-semibold",
                    p.side === "BUY"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-destructive/15 text-destructive",
                  )}
                >
                  {p.side}
                </span>
              </td>
              <td className="text-muted-foreground">{p.lots.toFixed(1)}</td>
              <td className="text-right text-muted-foreground">{p.entry}</td>
              <td className="text-right text-muted-foreground">{p.current}</td>
              <td className={cn(
                "text-right font-semibold",
                p.pnl >= 0 ? "text-emerald-500" : "text-destructive",
              )}>
                {p.pnl >= 0 ? "+" : ""}{p.pnl} ({p.pnlPct}%)
              </td>
              <td className="text-right">
                <button
                  onClick={() => closePosition(p.id)}
                  className="inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-destructive/10 text-destructive transition-colors"
                  title="Tutup Posisi"
                >
                  <X className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
