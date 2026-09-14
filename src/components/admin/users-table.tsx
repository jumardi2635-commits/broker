"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, PlusCircle } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { adminAdjustUserBalance, adminSetUserBanned } from "@/app/actions/admin";
import { formatIdr } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  createdAt: Date;
  mainBalance: number | null;
  totalWithdrawn: number | null;
  referralCode: string | null;
};

export function UsersTable({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openAdjust(id: string) {
    setEditingId(id);
    setAmount("");
    setError(null);
  }

  function submitAdjust() {
    const delta = Number(amount);
    if (!Number.isFinite(delta) || delta === 0) {
      setError("Masukkan jumlah yang valid (boleh negatif untuk mengurangi)");
      return;
    }
    startTransition(async () => {
      try {
        await adminAdjustUserBalance(editingId!, delta);
        router.refresh();
        setEditingId(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyesuaikan saldo");
      }
    });
  }

  function toggleBan(id: string, banned: boolean) {
    startTransition(async () => {
      await adminSetUserBanned(id, banned);
      router.refresh();
    });
  }

  return (
    <Panel className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Pengguna</th>
              <th className="px-5 py-3 text-right font-medium">Saldo</th>
              <th className="px-5 py-3 text-right font-medium">Total Tarik</th>
              <th className="px-5 py-3 font-medium">Bergabung</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  Belum ada pengguna terdaftar.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-border/60 last:border-0 align-top">
                  <td className="px-5 py-3">
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">
                    {formatIdr(u.mainBalance ?? 0)}
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground">
                    {formatIdr(u.totalWithdrawn ?? 0)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDateTime(u.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        u.banned
                          ? "bg-destructive/15 text-destructive"
                          : "bg-emerald-500/15 text-emerald-500",
                      )}
                    >
                      {u.banned ? "Diblokir" : "Aktif"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openAdjust(u.id)}
                        aria-label={`Sesuaikan saldo ${u.name}`}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <PlusCircle className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBan(u.id, !u.banned)}
                        disabled={isPending}
                        aria-label={u.banned ? `Buka blokir ${u.name}` : `Blokir ${u.name}`}
                        className={cn(
                          "rounded-md p-1.5 transition-colors",
                          u.banned
                            ? "text-emerald-500 hover:bg-emerald-500/10"
                            : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                        )}
                      >
                        {u.banned ? <CheckCircle2 className="size-4" /> : <Ban className="size-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
            <h3 className="mb-4 text-base font-bold">Sesuaikan Saldo</h3>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Jumlah (Rp) — gunakan angka negatif untuk mengurangi
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500000"
              className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            {error ? (
              <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-semibold hover:bg-secondary"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitAdjust}
                disabled={isPending}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
