import { Users, TrendingUp, Layers, Headset } from "lucide-react";
import { homeStats } from "@/lib/mock-data";

const icons = [Users, TrendingUp, Layers, Headset];

export function StatsStrip() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {homeStats.map(({ label, value }, i) => {
        const Icon = icons[i];
        return (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{label}</p>
              <p className="truncate text-sm font-bold">{value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
