"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { transactions, formatIdr, type WalletTx } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const filters: Array<{ label: string; type?: WalletTx["type"] }> = [
  { label: "Semua" },
  { label: "Deposit", type: "Deposit" },
  { label: "Penarikan", type: "Penarikan" },
  { label: "Bonus", type: "Bonus" },
  { label: "Profit EA", type: "Profit EA" },
];

const statusStyle: Record<string, string> = {
  Selesai: "bg-emerald-500/15 text-emerald-500",
  Diproses: "bg-accent/20 text-accent-foreground",
  Ditolak: "bg-destructive/15 text-destructive",
};

export default function HistoryPage() {
  const [active, setActive] = useState("Semua");

  const filtered = useMemo(() => {
    const filter = filters.find((f) => f.label === active);
    if (!filter?.type) return transactions;
    return transactions.filter((tx) => tx.type === filter.type);
  }, [active]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/wallet"
          aria-label="Kembali"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Riwayat Transaksi</h1>
          <p className="text-sm text-muted-foreground">
            Semua deposit, penarikan, bonus, dan profit EA Anda.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setActive(f.label)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              active === f.label
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-secondary/50 text-muted-foreground hover:border-primary hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Panel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Jenis</th>
                <th className="px-5 py-3 text-right font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    Belum ada transaksi pada kategori ini.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-border/60 last:border-0 hover:bg-secondary/50"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{tx.id}</td>
                    <td className="px-5 py-3 font-semibold">{tx.type}</td>
                    <td
                      className={cn(
                        "px-5 py-3 text-right font-semibold",
                        tx.type === "Penarikan" ? "text-destructive" : "text-emerald-500",
                      )}
                    >
                      {tx.type === "Penarikan" ? "-" : "+"}
                      {formatIdr(tx.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          statusStyle[tx.status],
                        )}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{tx.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
