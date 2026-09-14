"use client";

import { cn } from "@/lib/utils";

interface Instrument {
  symbol: string;
  name: string;
  price: string;
  change: number;
}

const mockDepth = [
  { price: "1.0950", volume: 2.5, side: "ask" as const },
  { price: "1.0949", volume: 3.2, side: "ask" as const },
  { price: "1.0948", volume: 4.1, side: "ask" as const },
  { price: "1.0945", volume: 5.8, side: "bid" as const },
  { price: "1.0944", volume: 4.3, side: "bid" as const },
  { price: "1.0943", volume: 3.9, side: "bid" as const },
];

const maxVolume = Math.max(...mockDepth.map(d => d.volume));

export function MarketDepth({ instrument }: { instrument: Instrument }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-secondary/30 p-2">
        <p className="text-center text-xs font-semibold text-muted-foreground">Harga Saat Ini</p>
        <p className="mt-1 text-center text-lg font-bold">{instrument.price}</p>
      </div>

      <div className="space-y-1.5">
        {mockDepth.map((level, idx) => {
          const isAsk = level.side === "ask";
          const percentage = (level.volume / maxVolume) * 100;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={cn(
                  "font-semibold",
                  isAsk ? "text-destructive" : "text-emerald-500"
                )}>
                  {level.price}
                </span>
                <span className="text-muted-foreground">{level.volume.toFixed(1)}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-secondary/50">
                <div
                  className={cn(
                    "h-full transition-all",
                    isAsk ? "bg-destructive/60" : "bg-emerald-500/60"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
