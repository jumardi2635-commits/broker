"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import { CheckCircle2, Radio, TrendingDown, TrendingUp } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { formatIdr } from "@/lib/mock-data";
import { buyPackage } from "@/app/actions/packages";
import { cn } from "@/lib/utils";

type EaPackageRow = {
  id: number;
  name: string;
  asset: string;
  tier: string;
  price: number;
  returnPct: string;
  durationDays: number;
  popular: boolean;
};

type InvestmentRow = {
  id: number;
  modal: number;
  status: string;
  createdAt: Date;
  package: EaPackageRow;
};

const TICK_MS = 1500;
const HISTORY_LENGTH = 60;

function dailyReturn(pkg: EaPackageRow) {
  const total = pkg.price * (Number(pkg.returnPct) / 100);
  return Math.round(total / pkg.durationDays);
}

function seedSeries(base: number) {
  const series: number[] = [base];
  for (let i = 1; i < HISTORY_LENGTH; i++) {
    const prev = series[i - 1];
    const drift = (Math.random() - 0.48) * (base * 0.004);
    series.push(Math.max(base * 0.9, prev + drift));
  }
  return series;
}

export function TradeTerminal({
  packages,
  investments,
  mainBalance,
}: {
  packages: EaPackageRow[];
  investments: InvestmentRow[];
  mainBalance: number;
}) {
  const router = useRouter();
  const [active, setActive] = useState<EaPackageRow>(packages[0]);
  const [series, setSeries] = useState<number[]>(() => seedSeries(100));
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeries(seedSeries(100));
    const t = setTimeout(() => setConnected(true), 400);
    return () => clearTimeout(t);
  }, [active?.id]);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1] ?? 100;
        const drift = (Math.random() - 0.47) * 1.2;
        const next = Math.max(70, last + drift);
        return [...prev.slice(1), next];
      });
    }, TICK_MS);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const chartData = useMemo(() => series.map((v, i) => ({ i, v })), [series]);
  const last = series[series.length - 1] ?? 0;
  const prev = series[series.length - 2] ?? last;
  const tickUp = last >= prev;
  const changePct = prev ? (((last - prev) / prev) * 100).toFixed(2) : "0.00";

  const totalDailyProfit = investments.reduce((sum, p) => sum + dailyReturn(p.package), 0);

  function handleBuy() {
    if (!active) return;
    setError(null);
    startTransition(async () => {
      try {
        await buyPackage(active.id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal membeli paket");
      }
    });
  }

  if (!active) {
    return (
      <Panel>
        <p className="py-8 text-center text-sm text-muted-foreground">
          Belum ada paket EA yang tersedia saat ini.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        {/* Live chart panel */}
        <Panel>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">{active.name}</h2>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                  {active.asset}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    connected
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Radio className={cn("size-3", connected && "animate-pulse")} />
                  {connected ? "LIVE" : "Menghubungkan..."}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {active.tier} · {active.durationDays} hari
              </p>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "flex items-center justify-end gap-1 text-2xl font-bold tabular-nums",
                  tickUp ? "text-emerald-500" : "text-destructive",
                )}
              >
                {tickUp ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
                {last.toFixed(2)}
              </div>
              <div className="flex items-center justify-end gap-3 text-[11px] text-muted-foreground">
                <span className={tickUp ? "text-emerald-500" : "text-destructive"}>
                  {tickUp ? "+" : ""}
                  {changePct}%
                </span>
                <span>Return {active.returnPct}%</span>
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
                  formatter={(v: number) => [v.toFixed(2), "Indeks Live"]}
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

        {/* Active investments (real) */}
        <Panel>
          <PanelHeader
            title="Paket EA Berjalan"
            hint={`${investments.length} paket aktif · dana nyata`}
            action={
              <span className="text-sm font-semibold tabular-nums text-emerald-500">
                +{formatIdr(totalDailyProfit)}/hari
              </span>
            }
          />
          {investments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada paket dibeli. Pilih paket EA di sisi kanan dan klik &quot;Beli Paket&quot; untuk memulai.
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
                  </tr>
                </thead>
                <tbody>
                  {investments.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 font-medium">{p.package.name}</td>
                      <td className="py-2.5">
                        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                          {p.package.asset}
                        </span>
                      </td>
                      <td className="py-2.5 text-right tabular-nums">{formatIdr(p.modal)}</td>
                      <td className="py-2.5 text-right font-semibold tabular-nums text-emerald-500">
                        +{formatIdr(dailyReturn(p.package))}
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
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Paket EA</label>
          <select
            value={active.id}
            onChange={(e) => {
              const found = packages.find((p) => p.id === Number(e.target.value));
              if (found) setActive(found);
            }}
            className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          >
            {packages.map((p) => (
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
              <dd className="font-semibold text-emerald-500">+{formatIdr(dailyReturn(active))}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Durasi</dt>
              <dd className="font-semibold">{active.durationDays} hari</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Saldo Anda</dt>
              <dd className="font-semibold">{formatIdr(mainBalance)}</dd>
            </div>
          </dl>

          {error ? (
            <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={handleBuy}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <CheckCircle2 className="size-4" />
            {isPending ? "Memproses..." : "Beli Paket"}
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Saldo akan langsung terpotong dari Saldo Utama Anda.
          </p>
        </Panel>

        <Panel>
          <PanelHeader title="Paket Populer" />
          <ul className="space-y-1">
            {packages
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
