"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { CheckCircle2, TrendingUp, X } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import {
  products,
  dailyReturn,
  totalReturn,
  formatIdr,
  type EaProduct,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ActivePurchase = {
  id: string;
  product: EaProduct;
};

export function TradeTerminal() {
  const [active, setActive] = useState<EaProduct>(products[3]);
  const [purchases, setPurchases] = useState<ActivePurchase[]>([]);

  const chartData = useMemo(
    () => active.spark.map((v, i) => ({ i, v })),
    [active],
  );

  const totalDailyProfit = purchases.reduce(
    (sum, p) => sum + dailyReturn(p.product),
    0,
  );

  function buyPackage() {
    setPurchases((prev) => [{ id: `P-${Date.now()}`, product: active }, ...prev]);
  }

  function cancelPackage(id: string) {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        {/* Chart panel */}
        <Panel>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">{active.name}</h2>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                  {active.asset}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {active.tier} · {active.durationDays} hari
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums text-emerald-500">
                +{active.returnPct}%
              </div>
              <div className="flex items-center justify-end gap-3 text-[11px] text-muted-foreground">
                <span>Modal {formatIdr(active.price)}</span>
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
                  formatter={(v: number) => [v.toFixed(2), "Indeks Performa"]}
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

        {/* Active purchases */}
        <Panel>
          <PanelHeader
            title="Paket Dibeli"
            hint="Demo — simulasi pembelian paket EA"
            action={
              <span className="text-sm font-semibold tabular-nums text-emerald-500">
                +{formatIdr(totalDailyProfit)}/hari
              </span>
            }
          />
          {purchases.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada paket dibeli. Pilih paket EA dan klik &quot;Beli Paket&quot; untuk memulai.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Paket</th>
                    <th className="pb-2 font-medium">Kelas Aset</th>
                    <th className="pb-2 text-right font-medium">Modal</th>
                    <th className="pb-2 text-right font-medium">Profit/Hari</th>
                    <th className="pb-2 text-right font-medium sr-only">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 font-medium">{p.product.name}</td>
                      <td className="py-2.5">
                        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                          {p.product.asset}
                        </span>
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {formatIdr(p.product.price)}
                      </td>
                      <td className="py-2.5 text-right font-semibold tabular-nums text-emerald-500">
                        +{formatIdr(dailyReturn(p.product))}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => cancelPackage(p.id)}
                          aria-label={`Batalkan ${p.product.name}`}
                          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {/* Order ticket + package list */}
      <div className="space-y-5">
        <Panel>
          <PanelHeader title="Detail Paket" />
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Paket EA
          </label>
          <select
            value={active.id}
            onChange={(e) => {
              const found = products.find((p) => p.id === e.target.value);
              if (found) setActive(found);
            }}
            className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.asset}
              </option>
            ))}
          </select>

          <dl className="mb-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Modal Investasi</dt>
              <dd className="font-semibold">{formatIdr(active.price)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Return Harian</dt>
              <dd className="font-semibold text-emerald-500">
                +{formatIdr(dailyReturn(active))}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Total Estimasi</dt>
              <dd className="font-semibold text-emerald-500">
                +{formatIdr(totalReturn(active))}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Durasi</dt>
              <dd className="font-semibold">{active.durationDays} hari</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={buyPackage}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <CheckCircle2 className="size-4" />
            Beli Paket
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Akun demo — tidak ada dana nyata yang digunakan.
          </p>
        </Panel>

        <Panel>
          <PanelHeader title="Paket Populer" />
          <ul className="space-y-1">
            {products
              .filter((p) => p.popular)
              .map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setActive(p)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-secondary",
                      active.id === p.id && "bg-secondary",
                    )}
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="flex items-center gap-0.5 tabular-nums text-emerald-500">
                      <TrendingUp className="size-3.5" />
                      {p.returnPct}%
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
