import type { Metadata } from "next";
import { PieChart } from "lucide-react";
import { account, formatIdr } from "@/lib/mock-data";
import { InvestTabs } from "./invest-tabs";
import { PromoBanner } from "@/components/dashboard/promo-banner";

export const metadata: Metadata = { title: "Investasi | Genius fx" };

export default function InvestPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Investasi Saya</h1>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Total Investasi</p>
            <p className="text-2xl font-bold tracking-tight">{formatIdr(account.totalInvestment)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Keuntungan</p>
            <p className="text-sm font-semibold text-emerald-500">+{formatIdr(account.totalReturn)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Return Rate (Rata-rata)</p>
            <p className="text-sm font-semibold text-emerald-500">+0.00%</p>
          </div>
        </div>
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <PieChart className="size-6" />
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="rounded-xl border border-border bg-card p-2">
          <p className="text-xs font-bold">{account.activePackages} Paket</p>
          <p className="text-[10px] text-muted-foreground">Investasi Aktif</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-2">
          <p className="text-xs font-bold">{formatIdr(account.totalInvestment)}</p>
          <p className="text-[10px] text-muted-foreground">Modal</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-2">
          <p className="text-xs font-bold">{formatIdr(account.totalReturn)}</p>
          <p className="text-[10px] text-muted-foreground">Direalisasikan</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-2">
          <p className="text-xs font-bold">{formatIdr(0)}</p>
          <p className="text-[10px] text-muted-foreground">Est. Profit</p>
        </div>
      </div>

      <InvestTabs />

      <PromoBanner
        href="/dashboard/market"
        icon="🎁"
        eyebrow="Tambah Investasi"
        title="Maksimalkan Profit!"
        subtitle="Pilih paket terbaik dan tingkatkan pendapatan harian Anda"
      />
    </div>
  );
}
