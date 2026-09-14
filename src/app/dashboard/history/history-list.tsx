"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Repeat, TrendingUp, Inbox } from "lucide-react";
import { transactions, formatIdr } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs = ["Semua", "Setoran", "Penarikan", "Transfer"] as const;

const typeMap: Record<string, (typeof tabs)[number]> = {
  Deposit: "Setoran",
  Penarikan: "Penarikan",
  Bonus: "Transfer",
  "Profit EA": "Transfer",
};

export function HistoryList() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Semua");

  const rows = useMemo(
    () => (tab === "Semua" ? transactions : transactions.filter((t) => typeMap[t.type] === tab)),
    [tab],
  );

  const totals = useMemo(() => {
    const setoran = transactions.filter((t) => t.type === "Deposit").reduce((s, t) => s + t.amount, 0);
    const penarikan = transactions.filter((t) => t.type === "Penarikan").reduce((s, t) => s + t.amount, 0);
    const transfer = transactions.filter((t) => t.type === "Bonus").reduce((s, t) => s + t.amount, 0);
    const laba = transactions.filter((t) => t.type === "Profit EA").reduce((s, t) => s + t.amount, 0);
    return { setoran, penarikan, transfer, laba };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-border text-sm">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 pb-2 font-medium transition-colors",
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-bold">Ringkasan</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-card p-3">
            <ArrowDownLeft className="size-4 text-emerald-500" />
            <p className="mt-2 text-xs text-muted-foreground">Total Setoran</p>
            <p className="text-sm font-bold">{formatIdr(totals.setoran)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <ArrowUpRight className="size-4 text-destructive" />
            <p className="mt-2 text-xs text-muted-foreground">Total Penarikan</p>
            <p className="text-sm font-bold">{formatIdr(totals.penarikan)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <Repeat className="size-4 text-accent" />
            <p className="mt-2 text-xs text-muted-foreground">Total Transfer</p>
            <p className="text-sm font-bold">{formatIdr(totals.transfer)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <TrendingUp className="size-4 text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">Total Laba/Rugi</p>
            <p className="text-sm font-bold">{formatIdr(totals.laba)}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold">Riwayat</h2>
          <span className="text-xs font-semibold text-primary">{rows.length} data</span>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-10 text-center">
            <Inbox className="size-8 text-muted-foreground/40" />
            <p className="text-sm font-semibold">Tidak ada riwayat</p>
            <p className="text-xs text-muted-foreground">Coba ubah filter atau kata kunci</p>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {rows.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      tx.type === "Penarikan" ? "text-destructive" : "text-emerald-500",
                    )}
                  >
                    {tx.type === "Penarikan" ? "-" : "+"}
                    {formatIdr(tx.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
