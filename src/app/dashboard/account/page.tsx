import type { Metadata } from "next";
import {
  Settings,
  Bell,
  BadgeCheck,
  ChevronRight,
  Wallet,
  TrendingUp,
  Layers,
  PiggyBank,
  UserRound,
  KeyRound,
  ShieldCheck,
  Landmark,
  History,
  Repeat,
  Gift,
  SlidersHorizontal,
  Headset,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import {
  account,
  accountDataMenu,
  accountInvestMenu,
  accountSettingsMenu,
  formatIdr,
  type AccountMenuItem,
} from "@/lib/mock-data";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = { title: "Akun Saya | Genius fx" };

const icons: Record<AccountMenuItem["icon"], React.ComponentType<{ className?: string }>> = {
  profile: UserRound,
  password: KeyRound,
  shield: ShieldCheck,
  bank: Landmark,
  wallet: Wallet,
  history: History,
  swap: Repeat,
  gift: Gift,
  settings: SlidersHorizontal,
  help: Headset,
};

function MenuGroup({ title, items }: { title: string; items: AccountMenuItem[] }) {
  return (
    <div>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {items.map(({ label, hint, icon }) => {
          const Icon = icons[icon];
          return (
            <button
              key={label}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{hint}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Akun Saya</h1>
          <p className="text-sm text-muted-foreground">
            Atur profil, dompet, dan pengaturan aplikasi
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Pengaturan"
            className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <Settings className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          {account.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{account.phone}</p>
          <p className="text-xs text-muted-foreground">{account.id}</p>
          {account.verified ? (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500">
              <BadgeCheck className="size-3" />
              Akun Aktif
            </span>
          ) : null}
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-bold">Ringkasan Dompet</h2>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <span className="mx-auto mb-1 grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="size-4" />
            </span>
            <p className="text-[10px] text-muted-foreground">Total Aset</p>
            <p className="text-xs font-bold">{formatIdr(account.totalBalance)}</p>
          </div>
          <div>
            <span className="mx-auto mb-1 grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="size-4" />
            </span>
            <p className="text-[10px] text-muted-foreground">Profit Berjalan</p>
            <p className="text-xs font-bold">{formatIdr(account.eaProfit)}</p>
          </div>
          <div>
            <span className="mx-auto mb-1 grid size-8 place-items-center rounded-lg bg-accent/15 text-accent">
              <Layers className="size-4" />
            </span>
            <p className="text-[10px] text-muted-foreground">Modal Investasi</p>
            <p className="text-xs font-bold">{formatIdr(account.totalInvestment)}</p>
          </div>
          <div>
            <span className="mx-auto mb-1 grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <PiggyBank className="size-4" />
            </span>
            <p className="text-[10px] text-muted-foreground">Saldo Tersedia</p>
            <p className="text-xs font-bold">{formatIdr(account.mainBalance)}</p>
          </div>
        </div>
      </div>

      <MenuGroup title="Data Akun" items={accountDataMenu} />
      <MenuGroup title="Dompet & Investasi" items={accountInvestMenu} />

      <div>
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Pengaturan
        </h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {accountSettingsMenu.map(({ label, hint, icon }) => {
            const Icon = icons[icon];
            return (
              <button key={label} type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="truncate text-xs text-muted-foreground">{hint}</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
          <div className="flex w-full items-center gap-3 px-4 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <SlidersHorizontal className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Mode Tampilan</p>
              <p className="text-xs text-muted-foreground">Ganti tampilan terang atau gelap</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">Kode Undangan</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="font-mono text-lg font-bold tracking-widest text-primary">
            {account.referralCode}
          </p>
          <Link
            href="/dashboard/bonus"
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
          >
            Lihat Jaringan
          </Link>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {account.referrals} teman bergabung · {formatIdr(account.referralBonus)} bonus
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3 text-sm font-semibold text-destructive"
      >
        <LogOut className="size-4" />
        Keluar dari Akun
      </Link>
    </div>
  );
}
