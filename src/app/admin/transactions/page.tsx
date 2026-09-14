import { adminListTransactions } from "@/app/actions/admin";
import { TransactionsTable } from "@/components/admin/transactions-table";

export const metadata = { title: "Deposit & Penarikan | Admin Genius fx" };

export default async function AdminTransactionsPage() {
  const transactions = await adminListTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Deposit &amp; Penarikan</h1>
        <p className="text-sm text-muted-foreground">
          Setujui atau tolak permintaan deposit dan penarikan pengguna. Menyetujui akan langsung
          memperbarui saldo pengguna.
        </p>
      </div>
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
