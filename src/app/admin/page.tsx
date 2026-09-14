import Link from "next/link";
import { ArrowLeftRight, Layers, Users, Wallet } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { adminGetStats, adminListTransactions } from "@/app/actions/admin";
import { formatIdr } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Admin Overview | Genius fx" };

export default async function AdminOverviewPage() {
  const [stats, pending] = await Promise.all([
    adminGetStats(),
    adminListTransactions("pending"),
  ]);

  const cards = [
    { label: "Total Pengguna", value: stats.userCount.toLocaleString("id-ID"), icon: Users },
    { label: "Total Saldo Pengguna", value: formatIdr(stats.totalUserBalance), icon: Wallet },
    { label: "Investasi Aktif", value: formatIdr(stats.totalInvested), icon: Layers },
    { label: "Menunggu Persetujuan", value: String(stats.pendingRequests), icon: ArrowLeftRight },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Ringkasan Admin</h1>
        <p className="text-sm text-muted-foreground">
          Pantau aktivitas platform dan tindak lanjuti permintaan pengguna.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Panel key={label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-lg font-bold tracking-tight">{value}</p>
          </Panel>
        ))}
      </div>

      <Panel className="p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Permintaan Menunggu Persetujuan</h2>
          <Link href="/admin/transactions" className="text-xs font-semibold text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Pengguna</th>
                <th className="px-5 py-3 font-medium">Jenis</th>
                <th className="px-5 py-3 text-right font-medium">Jumlah</th>
                <th className="px-5 py-3 text-right font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                    Tidak ada permintaan yang menunggu.
                  </td>
                </tr>
              ) : (
                pending.slice(0, 8).map((tx) => (
                  <tr key={tx.id} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-semibold">{tx.userName ?? "Pengguna"}</p>
                      <p className="text-xs text-muted-foreground">{tx.userEmail}</p>
                    </td>
                    <td className="px-5 py-3 capitalize">
                      {tx.type === "deposit" ? "Deposit" : "Penarikan"}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">{formatIdr(tx.amount)}</td>
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
