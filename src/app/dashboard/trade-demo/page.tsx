import { ArrowDownRight, ArrowUpRight, TrendingUp, Zap } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { OrderForm } from "@/components/trading-demo/order-form";
import { MarketDepth } from "@/components/trading-demo/market-depth";
import { DemoPositions } from "@/components/trading-demo/demo-positions";
import { DemoStats } from "@/components/trading-demo/demo-stats";
import { account, instruments, formatUsd } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata = { title: "Trading Demo | Genius fx" };

const demoStats = [
  { label: "Saldo Demo", value: "$10,000.00", change: "+0%" },
  { label: "Equity Demo", value: "$10,000.00", change: "+0%" },
  { label: "Win Rate", value: "0%", change: "0" },
  { label: "Total Trades", value: "0", change: "0" },
];

export default function TradingDemoPage() {
  const selectedInstrument = instruments[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Paper Trading</p>
          <h1 className="text-xl font-bold tracking-tight">Trading Demo Simulator</h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <Zap className="size-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-500">Mode Demo Aktif</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {demoStats.map(({ label, value, change }) => (
          <Panel key={label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <TrendingUp className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-lg font-bold tracking-tight">{value}</p>
            <p className={cn(
              "mt-1 text-xs font-medium",
              change.startsWith("+") ? "text-emerald-500" : "text-muted-foreground"
            )}>
              {change}
            </p>
          </Panel>
        ))}
      </div>

      {/* Main Trading Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Form & Market Depth */}
        <Panel className="lg:col-span-2">
          <PanelHeader title="Buat Pesanan" hint="Paper Trading" />
          <OrderForm instrument={selectedInstrument} />
        </Panel>

        {/* Market Depth */}
        <Panel>
          <PanelHeader title="Kedalaman Pasar" hint={selectedInstrument.symbol} />
          <MarketDepth instrument={selectedInstrument} />
        </Panel>
      </div>

      {/* Positions & History */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Posisi Demo" hint="Transaksi paper trading" />
          <DemoPositions />
        </Panel>

        {/* Quick Stats */}
        <Panel>
          <PanelHeader title="Statistik" hint="Performa demo" />
          <DemoStats />
        </Panel>
      </div>
    </div>
  );
}
