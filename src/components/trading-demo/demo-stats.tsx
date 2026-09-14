"use client";

import { TrendingUp, TrendingDown, Target, Clock } from "lucide-react";

const stats = [
  {
    label: "Total P/L",
    value: "+$105.00",
    change: "+1.05%",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
  {
    label: "Posisi Aktif",
    value: "2",
    change: "trades",
    icon: Target,
    color: "text-primary",
  },
  {
    label: "Waktu Tersingkat",
    value: "5m 23s",
    change: "trade",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    label: "Win Rate",
    value: "100%",
    change: "2 / 2",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
];

export function DemoStats() {
  return (
    <ul className="space-y-3">
      {stats.map(({ label, value, change, icon: Icon, color }) => (
        <li key={label} className="rounded-lg border border-border/50 bg-secondary/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <Icon className={`size-3.5 ${color}`} />
          </div>
          <p className="text-sm font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{change}</p>
        </li>
      ))}
    </ul>
  );
}
