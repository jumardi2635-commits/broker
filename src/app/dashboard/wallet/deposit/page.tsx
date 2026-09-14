"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, ShieldCheck, Upload } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { depositChips, paymentMethods, formatIdr } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function DepositPage() {
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [methodId, setMethodId] = useState(paymentMethods[0].id);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const method = useMemo(
    () => paymentMethods.find((m) => m.id === methodId) ?? paymentMethods[0],
    [methodId],
  );

  const fee = Math.round(amount * (method.feePct / 100));
  const total = amount + fee;
  const canSubmit = amount >= method.minAmount;

  function handleChip(value: number) {
    setAmount(value);
    setCustomAmount(String(value));
  }

  function handleCustomAmount(value: string) {
    const digits = value.replace(/\D/g, "");
    setCustomAmount(digits);
    setAmount(digits ? Number(digits) : 0);
  }

  function handleCopy() {
    navigator.clipboard?.writeText(method.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <Check className="size-8" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Konfirmasi Deposit Terkirim</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Deposit {formatIdr(amount)} via {method.name} sedang diverifikasi. Saldo akan
            masuk otomatis setelah pembayaran dikonfirmasi, biasanya dalam 1-10 menit.
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
          <h1 className="text-xl font-bold tracking-tight">Deposit Saldo</h1>
          <p className="text-sm text-muted-foreground">Isi saldo untuk mulai berinvestasi.</p>
        </div>
      </div>

      <Panel>
        <PanelHeader title="Nominal Deposit" hint="Pilih nominal cepat atau masukkan sendiri" />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {depositChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChip(chip)}
              className={cn(
                "rounded-lg border px-2 py-2.5 text-xs font-semibold transition-colors",
                amount === chip
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/50 hover:border-primary",
              )}
            >
              {formatIdr(chip)}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <label htmlFor="custom-amount" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Atau masukkan nominal lain
          </label>
          <div className="flex items-center rounded-lg border border-input bg-card px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
            <span className="text-sm text-muted-foreground">Rp</span>
            <input
              id="custom-amount"
              inputMode="numeric"
              value={customAmount ? Number(customAmount).toLocaleString("id-ID") : ""}
              onChange={(e) => handleCustomAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
            />
          </div>
          {amount > 0 && amount < method.minAmount ? (
            <p className="mt-1.5 text-xs text-destructive">
              Minimal deposit {formatIdr(method.minAmount)} untuk {method.name}.
            </p>
          ) : null}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Metode Pembayaran" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {paymentMethods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethodId(m.id)}
              className={cn(
                "rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors",
                methodId === m.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/50 hover:border-primary",
              )}
            >
              <p>{m.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.category}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Instruksi Pembayaran" hint={`Transfer ke ${method.name}`} />
        <div className="space-y-3 rounded-lg border border-border bg-secondary/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Atas Nama</span>
            <span className="text-sm font-semibold">{method.accountName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Nomor Tujuan</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold">{method.accountNumber}</span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Salin nomor"
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              </button>
            </div>
          </div>
          {fee > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Biaya Layanan ({method.feePct}%)</span>
              <span className="text-sm">{formatIdr(fee)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold">Total Transfer</span>
            <span className="text-base font-bold text-primary">{formatIdr(total)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5 text-xs text-accent-foreground">
          <ShieldCheck className="size-4 shrink-0" />
          Transfer sesuai nominal persis di atas agar verifikasi otomatis berjalan cepat.
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="size-4" />
          Saya Sudah Transfer
        </button>
      </Panel>
    </div>
  );
}
