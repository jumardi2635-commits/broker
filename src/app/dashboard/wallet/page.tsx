import { Gift } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { WalletActions } from "@/components/dashboard/wallet-actions";
import { getWalletData } from "@/app/actions/wallet";
import { formatIdr } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dompet | Genius fx" };

const typeLabel: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Penarikan",
  bonus: "Bonus",
  profit: "Investasi",
};

const statusLabel: Record<string, string> = {
  pending: "Diproses",
  approved: "Selesai",
  rejected: "Ditolak",
};

const statusStyle: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-500",
  pending: "bg-accent/20 text-accent-foreground",
  rejected: "bg-destructive/15 text-destructive",
};

export default async function WalletPage() {
  const { mainBalance, transactions } = await getWalletData();

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
            <p className="mt-1 text-3xl font-bold tracking-tight">{formatIdr(mainBalance)}</p>
          </div>
          <WalletActions mainBalance={mainBalance} />
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Metode Pembayaran" hint="Deposit instan tanpa biaya" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["Transfer Bank", "Kartu Kredit", "E-Wallet", "USDT (TRC20)", "USDT (ERC20)", "QRIS"].map(
              (m) => (
                <div
                  key={m}
                  className="rounded-lg border border-border bg-secondary/50 px-3 py-4 text-center text-sm font-medium"
                >
                  {m}
                </div>
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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-border/60 last:border-0 hover:bg-secondary/50"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      TX-{String(tx.id).padStart(4, "0")}
                    </td>
                    <td className="px-5 py-3 font-semibold">{typeLabel[tx.type] ?? tx.type}</td>
                    <td
                      className={cn(
                        "px-5 py-3 text-right font-semibold",
                        tx.type === "withdrawal" || tx.type === "profit"
                          ? "text-destructive"
                          : "text-emerald-500",
                      )}
                    >
                      {tx.type === "withdrawal" || tx.type === "profit" ? "-" : "+"}
                      {formatIdr(tx.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          statusStyle[tx.status],
                        )}
                      >
                        {statusLabel[tx.status] ?? tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {formatDateTime(tx.createdAt)}
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
