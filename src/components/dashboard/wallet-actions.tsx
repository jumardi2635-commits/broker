"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, ArrowUpFromLine, X } from "lucide-react";
import { requestDeposit, requestWithdrawal } from "@/app/actions/wallet";

const METHODS = ["Transfer Bank", "Kartu Kredit", "E-Wallet", "USDT (TRC20)", "USDT (ERC20)", "QRIS"];

export function WalletActions({ mainBalance }: { mainBalance: number }) {
  const router = useRouter();
  const [mode, setMode] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(METHODS[0]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function close() {
    setMode(null);
    setAmount("");
    setError(null);
  }

  function submit() {
    const value = Number(amount);
    setError(null);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Masukkan jumlah yang valid");
      return;
    }

    startTransition(async () => {
      try {
        if (mode === "deposit") {
          await requestDeposit(value, method);
          setSuccess("Permintaan deposit terkirim. Menunggu persetujuan admin.");
        } else {
          await requestWithdrawal(value, method);
          setSuccess("Permintaan penarikan terkirim. Menunggu persetujuan admin.");
        }
        router.refresh();
        close();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengirim permintaan");
      }
    });
  }

  return (
    <>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("deposit")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-foreground/15 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-primary-foreground/25"
        >
          <ArrowDownToLine className="size-4" />
          Deposit
        </button>
        <button
          type="button"
          onClick={() => setMode("withdraw")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-foreground/15 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-primary-foreground/25"
        >
          <ArrowUpFromLine className="size-4" />
          Tarik
        </button>
      </div>

      {success ? (
        <p className="mt-3 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">
          {success}
        </p>
      ) : null}

      {mode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">
                {mode === "deposit" ? "Ajukan Deposit" : "Ajukan Penarikan"}
              </h3>
              <button
                type="button"
                onClick={close}
                aria-label="Tutup"
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            </div>

            {mode === "withdraw" ? (
              <p className="mb-3 text-xs text-muted-foreground">
                Saldo tersedia: <span className="font-semibold text-foreground">Rp{mainBalance.toLocaleString("id-ID")}</span>
              </p>
            ) : null}

            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Jumlah (Rp)</label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />

            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Metode</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {error ? (
              <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={isPending}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Mengirim..." : "Kirim Permintaan"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
