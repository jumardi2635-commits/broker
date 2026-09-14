import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, HelpCircle, Sparkles, Lock, CheckCircle2, Users, Shield, ChevronRight } from "lucide-react";
import { bonusSummary, bonusTiers, formatIdr } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Bonus & Referral | Genius fx" };

export default function BonusPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard"
            aria-label="Kembali"
            className="mt-0.5 rounded-lg border border-border bg-card p-2 text-muted-foreground"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Bonus</h1>
            <p className="text-sm text-muted-foreground">
              Dapatkan bonus dan tingkatkan peluang trading Anda
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Informasi"
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground"
        >
          <HelpCircle className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold">
            Lebih Banyak Bonus, <span className="text-primary">Lebih Banyak Peluang!</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Manfaatkan berbagai bonus eksklusif dari Genius fx untuk trading lebih maksimal.
          </p>
          <button
            type="button"
            className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Sparkles className="size-3.5" />
            Lihat Cara Mendapatkan Bonus
          </button>
        </div>
        <span className="text-3xl" aria-hidden>
          🎁
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <p className="text-xs text-muted-foreground">Total Bonus Saya</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{formatIdr(bonusSummary.totalBonus)}</p>
          <Link href="#" className="text-xs font-semibold text-primary">
            Riwayat Bonus →
          </Link>
        </div>
        <div className="space-y-1.5 text-right text-xs">
          <p className="text-muted-foreground">
            Bonus Aktif <span className="ml-1 font-bold text-emerald-500">{formatIdr(bonusSummary.bonusActive)}</span>
          </p>
          <p className="text-muted-foreground">
            Bonus Terkunci <span className="ml-1 font-bold text-accent">{formatIdr(bonusSummary.bonusLocked)}</span>
          </p>
          <p className="text-muted-foreground">
            Sudah Diklaim <span className="ml-1 font-bold">{formatIdr(bonusSummary.bonusClaimed)}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="size-4 text-emerald-500" />
          Bonus Aktif
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">0 bonus</span>
        </span>
      </div>
      <div className="rounded-xl border border-dashed border-border py-6 text-center">
        <p className="text-sm text-muted-foreground">Belum ada bonus aktif. Undang referral untuk mulai!</p>
        <Link href="#referral" className="mt-1 inline-block text-sm font-semibold text-primary">
          Program Referral →
        </Link>
      </div>

      <div id="referral" className="flex items-center justify-between px-1">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Lock className="size-4 text-accent" />
          Bonus Terkunci
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{bonusTiers.length} bonus</span>
        </span>
      </div>

      <div className="space-y-3">
        {bonusTiers.map((tier) => (
          <div
            key={tier.amount}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-semibold">
                Bonus Referral
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                  Terkunci
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Reward dari jaringan referral</p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-accent">
                <Lock className="size-3" />
                Butuh {tier.targetReferrals} referral lagi untuk membuka
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-accent">{formatIdr(tier.amount)}</p>
              <p className="text-[10px] text-muted-foreground">Min. Referral</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Shield className="size-4" />
        </span>
        <div>
          <p className="text-sm font-bold">Adil &amp; Transparan</p>
          <p className="text-xs text-muted-foreground">
            Semua bonus dilacak secara otomatis berdasarkan aktivitas referral Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
