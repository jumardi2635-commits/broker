"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, Check, Landmark } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { account, formatIdr, minWithdraw, savedBankAccount, withdrawFeeFlat } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function WithdrawPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const amount = customAmount ? Number(customAmount) : 0;
  const insufficientBalance = amount > account.mainBalance;
  const belowMin = amount > 0 && amount < minWithdraw;
  const canSubmit = amount >= minWithdraw && !insufficientBalance;
  const net = Math.max(amount - withdrawFeeFlat, 0);

  function handleAmount(value: string) {
    setCustomAmount(value.replace(/\D/g, ""));
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <Check className="size-8" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Permintaan Penarikan Dikirim</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Penarikan {formatIdr(amount)} ke {savedBankAccount.bankName} akan diproses dalam
            1x24 jam kerja. Anda akan menerima notifikasi setelah dana ditransfer.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/wallet/history"
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            Lihat Riwayat
          </Link>
          <Link
            href="/dashboard/wallet"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-strong"
          >
            Kembali ke Dompet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/wallet"
          aria-label="Kembali"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Tarik Dana</h1>
          <p className="text-sm text-muted-foreground">Tarik saldo Anda ke rekening terdaftar.</p>
        </div>
      </div>

      <Panel className="bg-primary text-primary-foreground">
        <p className="text-sm opacity-80">Saldo Tersedia</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{formatIdr(account.mainBalance)}</p>
      </Panel>

      <Panel>
        <PanelHeader title="Rekening Tujuan" hint="Dana akan dikirim ke rekening terdaftar" />
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
            <Landmark className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">{savedBankAccount.bankName}</p>
            <p className="text-xs text-muted-foreground">
              {savedBankAccount.accountName} · {savedBankAccount.accountNumber}
            </p>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Jumlah Penarikan" hint={`Minimal ${formatIdr(minWithdraw)}`} />
        <div className="flex items-center rounded-lg border border-input bg-card px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
          <span className="text-sm text-muted-foreground">Rp</span>
          <input
            inputMode="numeric"
            value={customAmount ? Number(customAmount).toLocaleString("id-ID") : ""}
            onChange={(e) => handleAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setCustomAmount(String(account.mainBalance))}
            className="shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80"
          >
            Maks
          </button>
        </div>

        {belowMin ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
            <AlertTriangle className="size-3.5" />
            Minimal penarikan {formatIdr(minWithdraw)}.
          </p>
        ) : null}
        {insufficientBalance ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
            <AlertTriangle className="size-3.5" />
            Saldo tidak cukup untuk penarikan ini.
          </p>
        ) : null}

        <div className="mt-4 space-y-2 rounded-lg border border-border bg-secondary/40 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Biaya Admin</span>
            <span>{formatIdr(withdrawFeeFlat)}</span>
          </div>
          <div
            className={cn(
              "flex items-center justify-between border-t border-border pt-2 font-semibold",
            )}
          >
            <span>Dana Diterima</span>
            <span className="text-primary">{formatIdr(net)}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          Ajukan Penarikan
        </button>
      </Panel>
    </div>
  );
}
