import { ArrowDownRight, ArrowUpRight, TrendingUp, Wallet, Layers, PiggyBank } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { EquityChart } from "@/components/dashboard/equity-chart";
import { AllocationChart } from "@/components/dashboard/allocation-chart";
import { account, positions, instruments, formatUsd } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dashboard | Genius fx" };

const stats = [
  { label: "Saldo", value: account.balance, icon: Wallet },
  { label: "Ekuitas", value: account.equity, icon: TrendingUp },
  { label: "Margin Terpakai", value: account.margin, icon: Layers },
  { label: "Margin Bebas", value: account.freeMargin, icon: PiggyBank },
];

export default function DashboardPage() {
  const watchlist = instruments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Selamat datang kembali,</p>
          <h1 className="text-xl font-bold tracking-tight">{account.name}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <span className="text-xs text-muted-foreground">P/L Hari Ini</span>
          <span className="flex items-center gap-1 text-sm font-bold text-emerald-500">
            <ArrowUpRight className="size-4" />
            {formatUsd(account.todayPnl)} ({account.todayPnlPct}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Panel key={label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-lg font-bold tracking-tight">{formatUsd(value)}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Performa Ekuitas" hint="7 hari terakhir" />
          <EquityChart />
        </Panel>
        <Panel>
          <PanelHeader title="Alokasi Portofolio" hint="Berdasarkan kelas aset" />
          <AllocationChart />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Posisi Terbuka" hint={`${positions.length} posisi aktif`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Instrumen</th>
                  <th className="pb-2 font-medium">Arah</th>
                  <th className="pb-2 font-medium">Lot</th>
                  <th className="pb-2 text-right font-medium">Entri</th>
                  <th className="pb-2 text-right font-medium">P/L</th>
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
                    <td className="text-muted-foreground">{p.lots}</td>
                    <td className="text-right text-muted-foreground">{p.entry}</td>
                    <td
                      className={cn(
                        "text-right font-semibold",
                        p.pnl >= 0 ? "text-emerald-500" : "text-destructive",
                      )}
                    >
                      {p.pnl >= 0 ? "+" : ""}
                      {formatUsd(p.pnl)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Watchlist" hint="Instrumen favorit" />
          <ul className="space-y-1">
            {watchlist.map((it) => {
              const up = it.change >= 0;
              return (
                <li
                  key={it.symbol}
                  className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-secondary"
                >
                  <div>
                    <p className="text-sm font-semibold">{it.symbol}</p>
                    <p className="text-xs text-muted-foreground">{it.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{it.price}</p>
                    <p
                      className={cn(
                        "flex items-center justify-end gap-0.5 text-xs font-medium",
                        up ? "text-emerald-500" : "text-destructive",
                      )}
                    >
                      {up ? (
                        <ArrowUpRight className="size-3" />
                      ) : (
                        <ArrowDownRight className="size-3" />
                      )}
                      {Math.abs(it.change)}%
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
