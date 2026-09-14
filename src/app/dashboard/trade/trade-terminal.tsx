"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { instruments, formatUsd, type Instrument } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type OpenTrade = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  lots: number;
  entry: number;
  price: number;
};

const SPREAD = 0.0002;

function seedSeries(base: number): number[] {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < 40; i++) {
    v += (Math.random() - 0.5) * base * 0.004;
    out.push(v);
  }
  return out;
}

export function TradeTerminal() {
  const [active, setActive] = useState<Instrument>(instruments[3]);
  const [prices, setPrices] = useState<Record<string, number>>(() =>
    Object.fromEntries(instruments.map((i) => [i.symbol, i.price])),
  );
  const [series, setSeries] = useState<number[]>(() => seedSeries(active.price));
  const [lots, setLots] = useState("0.10");
  const [trades, setTrades] = useState<OpenTrade[]>([]);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef(active.price);

  // Simulated market ticks for every instrument.
  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) => {
        const next: Record<string, number> = {};
        for (const inst of instruments) {
          const cur = prev[inst.symbol] ?? inst.price;
          const drift = (Math.random() - 0.5) * inst.price * 0.0035;
          next[inst.symbol] = Math.max(cur + drift, inst.price * 0.5);
        }
        return next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const livePrice = prices[active.symbol] ?? active.price;

  // Track chart + flash direction whenever the active price changes.
  useEffect(() => {
    setSeries((s) => [...s.slice(-39), livePrice]);
    if (livePrice > prevPrice.current) setFlash("up");
    else if (livePrice < prevPrice.current) setFlash("down");
    prevPrice.current = livePrice;
    const t = setTimeout(() => setFlash(null), 350);
    return () => clearTimeout(t);
  }, [livePrice]);

  // Reset chart history when switching instruments.
  useEffect(() => {
    setSeries(seedSeries(prices[active.symbol] ?? active.price));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.symbol]);

  const digits = active.category === "Forex" ? 4 : 2;
  const ask = livePrice * (1 + SPREAD);
  const bid = livePrice * (1 - SPREAD);

  const chartData = useMemo(
    () => series.map((v, i) => ({ i, v })),
    [series],
  );

  function openTrade(side: "BUY" | "SELL") {
    const size = Number.parseFloat(lots);
    if (!Number.isFinite(size) || size <= 0) return;
    setTrades((prev) => [
      {
        id: `T-${Date.now()}`,
        symbol: active.symbol,
        side,
        lots: size,
        entry: side === "BUY" ? ask : bid,
        price: livePrice,
      },
      ...prev,
    ]);
  }

  function closeTrade(id: string) {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }

  function pnlFor(t: OpenTrade): number {
    const cur = prices[t.symbol] ?? t.price;
    const contract = t.symbol.includes("/") || t.symbol === "WTI" ? 100000 : 1;
    const raw = (cur - t.entry) * (t.side === "BUY" ? 1 : -1);
    // Scale to a believable demo P&L figure.
    const scale = contract === 1 ? t.lots : (t.lots * contract) / 1000;
    return raw * scale;
  }

  const totalPnl = trades.reduce((sum, t) => sum + pnlFor(t), 0);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        {/* Chart panel */}
        <Panel>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">
                  {active.symbol}
                </h2>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                  {active.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{active.name}</p>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "text-2xl font-bold tabular-nums transition-colors",
                  flash === "up" && "text-emerald-500",
                  flash === "down" && "text-destructive",
                )}
              >
                {livePrice.toFixed(digits)}
              </div>
              <div className="flex items-center justify-end gap-3 text-[11px] text-muted-foreground">
                <span>Bid {bid.toFixed(digits)}</span>
                <span>Ask {ask.toFixed(digits)}</span>
              </div>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="tradeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis domain={["dataMin", "dataMax"]} hide />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--popover-foreground)",
                  }}
                  labelFormatter={() => ""}
                  formatter={(v: number) => [v.toFixed(digits), "Harga"]}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#tradeFill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Open positions */}
        <Panel>
          <PanelHeader
            title="Posisi Terbuka"
            hint="Demo — P&L diperbarui mengikuti harga simulasi"
            action={
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  totalPnl >= 0 ? "text-emerald-500" : "text-destructive",
                )}
              >
                {totalPnl >= 0 ? "+" : ""}
                {formatUsd(totalPnl)}
              </span>
            }
          />
          {trades.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada posisi. Buka order BUY atau SELL untuk memulai.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Simbol</th>
                    <th className="pb-2 font-medium">Sisi</th>
                    <th className="pb-2 text-right font-medium">Lot</th>
                    <th className="pb-2 text-right font-medium">Entry</th>
                    <th className="pb-2 text-right font-medium">P&L</th>
                    <th className="pb-2 text-right font-medium sr-only">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => {
                    const pnl = pnlFor(t);
                    return (
                      <tr key={t.id} className="border-b border-border/60 last:border-0">
                        <td className="py-2.5 font-medium">{t.symbol}</td>
                        <td className="py-2.5">
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[11px] font-semibold",
                              t.side === "BUY"
                                ? "bg-emerald-500/15 text-emerald-500"
                                : "bg-destructive/15 text-destructive",
                            )}
                          >
                            {t.side}
                          </span>
                        </td>
                        <td className="py-2.5 text-right tabular-nums">{t.lots.toFixed(2)}</td>
                        <td className="py-2.5 text-right tabular-nums">
                          {t.entry.toFixed(t.symbol.includes("/") ? 4 : 2)}
                        </td>
                        <td
                          className={cn(
                            "py-2.5 text-right font-semibold tabular-nums",
                            pnl >= 0 ? "text-emerald-500" : "text-destructive",
                          )}
                        >
                          {pnl >= 0 ? "+" : ""}
                          {formatUsd(pnl)}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => closeTrade(t.id)}
                            aria-label={`Tutup posisi ${t.symbol}`}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {/* Order ticket + watchlist */}
      <div className="space-y-5">
        <Panel>
          <PanelHeader title="Order Ticket" />
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Instrumen
          </label>
          <select
            value={active.symbol}
            onChange={(e) => {
              const found = instruments.find((i) => i.symbol === e.target.value);
              if (found) setActive(found);
            }}
            className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          >
            {instruments.map((i) => (
              <option key={i.symbol} value={i.symbol}>
                {i.symbol} — {i.name}
              </option>
            ))}
          </select>

          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Ukuran (lot)
          </label>
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setLots((l) => Math.max(0.01, +(Number.parseFloat(l || "0") - 0.1).toFixed(2)).toFixed(2))
              }
              className="size-10 shrink-0 rounded-lg border border-input text-lg font-medium hover:bg-secondary"
              aria-label="Kurangi lot"
            >
              −
            </button>
            <input
              value={lots}
              onChange={(e) => setLots(e.target.value)}
              inputMode="decimal"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-center text-sm tabular-nums outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <button
              type="button"
              onClick={() =>
                setLots((l) => (Number.parseFloat(l || "0") + 0.1).toFixed(2))
              }
              className="size-10 shrink-0 rounded-lg border border-input text-lg font-medium hover:bg-secondary"
              aria-label="Tambah lot"
            >
              +
            </button>
          </div>

          <div className="mb-4 flex gap-2">
            {["0.10", "0.50", "1.00", "2.00"].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setLots(q)}
                className="flex-1 rounded-md border border-input py-1.5 text-xs tabular-nums text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openTrade("SELL")}
              className="flex flex-col items-center gap-0.5 rounded-lg bg-destructive px-3 py-3 text-destructive-foreground transition-opacity hover:opacity-90"
            >
              <span className="flex items-center gap-1 text-xs font-medium">
                <ArrowDownRight className="size-3.5" /> SELL
              </span>
              <span className="text-sm font-bold tabular-nums">{bid.toFixed(digits)}</span>
            </button>
            <button
              type="button"
              onClick={() => openTrade("BUY")}
              className="flex flex-col items-center gap-0.5 rounded-lg bg-emerald-600 px-3 py-3 text-white transition-opacity hover:opacity-90"
            >
              <span className="flex items-center gap-1 text-xs font-medium">
                <ArrowUpRight className="size-3.5" /> BUY
              </span>
              <span className="text-sm font-bold tabular-nums">{ask.toFixed(digits)}</span>
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Akun demo — tidak ada dana nyata yang digunakan.
          </p>
        </Panel>

        <Panel>
          <PanelHeader title="Watchlist" />
          <ul className="space-y-1">
            {instruments.slice(0, 6).map((i) => {
              const p = prices[i.symbol] ?? i.price;
              const d = i.category === "Forex" ? 4 : 2;
              return (
                <li key={i.symbol}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-secondary",
                      active.symbol === i.symbol && "bg-secondary",
                    )}
                  >
                    <span className="font-medium">{i.symbol}</span>
                    <span className="tabular-nums text-muted-foreground">{p.toFixed(d)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
