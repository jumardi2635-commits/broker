import { ArrowDownToLine, ArrowUpFromLine, Gift } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { account, transactions, formatUsd } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dompet | Genius fx" };

const statusStyle: Record<string, string> = {
  Selesai: "bg-emerald-500/15 text-emerald-500",
  Diproses: "bg-accent/20 text-accent-foreground",
  Ditolak: "bg-destructive/15 text-destructive",
};

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Dompet</h1>
        <p className="text-sm text-muted-foreground">
          Kelola saldo, deposit, dan penarikan Anda.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-1 flex flex-col justify-between bg-primary text-primary-foreground">
          <div>
            <p className="text-sm opacity-80">Saldo Tersedia</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              {formatUsd(account.balance)}
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-foreground/15 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-primary-foreground/25"
            >
              <ArrowDownToLine className="size-4" />
              Deposit
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-foreground/15 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-primary-foreground/25"
            >
              <ArrowUpFromLine className="size-4" />
              Tarik
            </button>
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Metode Pembayaran" hint="Deposit instan tanpa biaya" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["Transfer Bank", "Kartu Kredit", "E-Wallet", "USDT (TRC20)", "USDT (ERC20)", "QRIS"].map(
              (m) => (
                <button
                  key={m}
                  type="button"
                  className="rounded-lg border border-border bg-secondary/50 px-3 py-4 text-sm font-medium hover:border-primary hover:bg-secondary"
                >
                  {m}
                </button>
              ),
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5 text-xs text-accent-foreground">
            <Gift className="size-4 shrink-0" />
            Dapatkan bonus deposit 20% untuk setoran pertama Anda bulan ini.
          </div>
        </Panel>
      </div>

      <Panel className="p-0">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Riwayat Transaksi</h2>
        </div>
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
              {transactions.map((tx) => (
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
                    {formatUsd(tx.amount)}
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
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
