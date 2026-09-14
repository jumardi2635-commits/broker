import Link from "next/link";
import { products, dailyReturn, formatIdr } from "@/lib/mock-data";
import { Sparkline } from "@/components/dashboard/sparkline";

export function MarketSummary() {
  const rows = products.slice(0, 6);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight">Ringkasan Pasar</h2>
        <Link href="/dashboard/market" className="text-xs font-semibold text-primary">
          Lihat Semua
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {rows.map((p) => {
          const up = true;
          return (
            <Link
              key={p.id}
              href="/dashboard/market"
              className="flex w-40 shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-3"
            >
              <div>
                <p className="text-sm font-bold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.asset}</p>
              </div>
              <p className="text-sm font-semibold">{formatIdr(p.price)}</p>
              <div className="flex items-center justify-between">
                <span className={up ? "text-xs font-semibold text-emerald-500" : "text-xs font-semibold text-destructive"}>
                  +{formatIdr(dailyReturn(p))} · {p.returnPct}%
                </span>
                <Sparkline data={p.spark} up={up} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
