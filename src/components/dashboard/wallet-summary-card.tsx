import Link from "next/link";
import { Eye, Wallet, ArrowUpRight, ArrowDownToLine, ArrowUpFromLine, Repeat } from "lucide-react";
import { account, formatIdr } from "@/lib/mock-data";

export function WalletSummaryCard() {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Total Saldo <Eye className="size-3.5" />
        </span>
        <span className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-muted-foreground">
          IDR
        </span>
      </div>

      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
        {formatIdr(account.totalBalance)}
      </p>
      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-500">
        <ArrowUpRight className="size-3.5" />
        +Rp 0 (0.00%) Hari Ini
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-secondary/50 px-2 py-2.5 text-center">
          <p className="text-[11px] text-muted-foreground">Saldo Utama</p>
          <p className="mt-0.5 text-sm font-bold">{formatIdr(account.mainBalance)}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 px-2 py-2.5 text-center">
          <p className="text-[11px] text-muted-foreground">Profit EA</p>
          <p className="mt-0.5 text-sm font-bold text-emerald-500">{formatIdr(account.eaProfit)}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 px-2 py-2.5 text-center">
          <p className="text-[11px] text-muted-foreground">Dana Tarik</p>
          <p className="mt-0.5 text-sm font-bold text-accent">{formatIdr(account.withdrawn)}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Link
          href="/dashboard/history"
          className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 py-3 text-center hover:bg-secondary"
        >
          <ArrowDownToLine className="size-4 text-primary" />
          <span className="text-xs font-semibold">Setor</span>
          <span className="text-[10px] text-muted-foreground">Tambah dana</span>
        </Link>
        <Link
          href="/dashboard/history"
          className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 py-3 text-center hover:bg-secondary"
        >
          <ArrowUpFromLine className="size-4 text-primary" />
          <span className="text-xs font-semibold">Tarik</span>
          <span className="text-[10px] text-muted-foreground">Tarik dana</span>
        </Link>
        <Link
          href="/dashboard/invest"
          className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 py-3 text-center hover:bg-secondary"
        >
          <Repeat className="size-4 text-primary" />
          <span className="text-xs font-semibold">Transfer</span>
          <span className="text-[10px] text-muted-foreground">Pindah dana</span>
        </Link>
      </div>
      <span className="sr-only">
        <Wallet className="size-0" />
      </span>
    </section>
  );
}
