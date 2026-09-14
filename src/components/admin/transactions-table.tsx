"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { adminReviewTransaction } from "@/app/actions/admin";
import { formatIdr } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type AdminTransactionRow = {
  id: number;
  userId: string;
  type: string;
  amount: number;
  status: string;
  method: string | null;
  note: string | null;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
};

const statusStyle: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-500",
  pending: "bg-accent/20 text-accent-foreground",
  rejected: "bg-destructive/15 text-destructive",
};

const statusLabel: Record<string, string> = {
  approved: "Disetujui",
  pending: "Menunggu",
  rejected: "Ditolak",
};

export function TransactionsTable({ transactions }: { transactions: AdminTransactionRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function review(id: number, action: "approve" | "reject") {
    setError(null);
    setPendingId(id);
    startTransition(async () => {
      try {
        await adminReviewTransaction(id, action);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memproses transaksi");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      ) : null}
      <Panel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Pengguna</th>
                <th className="px-5 py-3 font-medium">Jenis</th>
                <th className="px-5 py-3 font-medium">Metode</th>
                <th className="px-5 py-3 text-right font-medium">Jumlah</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                    Tidak ada transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-semibold">{tx.userName ?? "Pengguna"}</p>
                      <p className="text-xs text-muted-foreground">{tx.userEmail}</p>
                    </td>
                    <td className="px-5 py-3 capitalize">
                      {tx.type === "deposit" ? "Deposit" : tx.type === "withdrawal" ? "Penarikan" : tx.type}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{tx.method ?? "-"}</td>
                    <td className="px-5 py-3 text-right font-semibold">{formatIdr(tx.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyle[tx.status])}>
                        {statusLabel[tx.status] ?? tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDateTime(tx.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      {tx.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => review(tx.id, "approve")}
                            disabled={isPending && pendingId === tx.id}
                            aria-label="Setujui"
                            className="rounded-md p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"
                          >
                            <Check className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => review(tx.id, "reject")}
                            disabled={isPending && pendingId === tx.id}
                            aria-label="Tolak"
                            className="rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
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
