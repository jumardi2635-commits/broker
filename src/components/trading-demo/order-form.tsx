"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Instrument {
  symbol: string;
  name: string;
  price: string;
  change: number;
}

export function OrderForm({ instrument }: { instrument: Instrument }) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [volume, setVolume] = useState("1.0");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log({
      instrument: instrument.symbol,
      side,
      volume,
      takeProfit,
      stopLoss,
      entryPrice: instrument.price,
    });
    
    setIsSubmitting(false);
    setVolume("1.0");
    setTakeProfit("");
    setStopLoss("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Instrument Selection */}
      <div className="rounded-lg border border-border bg-secondary/30 p-3">
        <p className="text-xs text-muted-foreground">Instrumen</p>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="font-semibold">{instrument.symbol}</p>
            <p className="text-xs text-muted-foreground">{instrument.name}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{instrument.price}</p>
            <p className={cn(
              "text-xs font-medium",
              instrument.change >= 0 ? "text-emerald-500" : "text-destructive"
            )}>
              {instrument.change >= 0 ? "+" : ""}{instrument.change}%
            </p>
          </div>
        </div>
      </div>

      {/* Side Selection */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setSide("BUY")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold transition-all",
            side === "BUY"
              ? "bg-emerald-500/20 text-emerald-500 ring-2 ring-emerald-500/50"
              : "border border-border text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-500"
          )}
        >
          <ArrowUp className="size-4" />
          BUY
        </button>
        <button
          type="button"
          onClick={() => setSide("SELL")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold transition-all",
            side === "SELL"
              ? "bg-destructive/20 text-destructive ring-2 ring-destructive/50"
              : "border border-border text-muted-foreground hover:border-destructive/30 hover:text-destructive"
          )}
        >
          <ArrowDown className="size-4" />
          SELL
        </button>
      </div>

      {/* Volume */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground">Volume (Lot)</label>
        <input
          type="number"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="1.0"
        />
      </div>

      {/* Take Profit */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground">Take Profit (TP)</label>
        <input
          type="text"
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Optional"
        />
      </div>

      {/* Stop Loss */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground">Stop Loss (SL)</label>
        <input
          type="text"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Optional"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full rounded-lg px-4 py-3 font-semibold transition-all flex items-center justify-center gap-2",
          side === "BUY"
            ? "bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-500/50"
            : "bg-destructive text-white hover:bg-destructive/90 disabled:bg-destructive/50"
        )}
      >
        <Send className="size-4" />
        {isSubmitting ? "Mengirim..." : `Buka ${side}`}
      </button>
    </form>
  );
}
