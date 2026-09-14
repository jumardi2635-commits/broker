"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Star } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
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

const categories = ["Semua", "Forex", "Emas", "Kripto"] as const;

export function MarketsTable({
  packages,
  mainBalance,
}: {
  packages: EaPackageRow[];
  mainBalance: number;
}) {
  const router = useRouter();
  const [active, setActive] = useState<(typeof categories)[number]>("Semua");
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rows = useMemo(
    () => (active === "Semua" ? packages : packages.filter((p) => p.asset === active)),
    [packages, active],
  );

  function handleBuy(id: number) {
    setError(null);
    setPendingId(id);
    startTransition(async () => {
      try {
        await buyPackage(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal membeli paket");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Saldo Anda: <span className="font-semibold text-foreground">{formatIdr(mainBalance)}</span>
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      ) : null}

      <Panel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Paket EA</th>
                <th className="px-5 py-3 font-medium">Kelas Aset</th>
                <th className="px-5 py-3 text-right font-medium">Modal</th>
                <th className="px-5 py-3 text-right font-medium">Return</th>
                <th className="px-5 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border/60 last:border-0 hover:bg-secondary/50"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Star className="size-4 text-muted-foreground/50" />
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.tier} · {p.durationDays} hari
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.asset}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatIdr(p.price)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center gap-0.5 font-medium text-emerald-500">
                      <ArrowUpRight className="size-3.5" />
                      {p.returnPct}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleBuy(p.id)}
                      disabled={isPending && pendingId === p.id}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-strong disabled:opacity-60"
                    >
                      {isPending && pendingId === p.id ? "Memproses..." : "Beli"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
