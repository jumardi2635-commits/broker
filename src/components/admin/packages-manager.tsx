"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, X } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import {
  adminCreatePackage,
  adminTogglePackageActive,
  adminUpdatePackage,
  type PackageInput,
} from "@/app/actions/admin";
import { formatIdr } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type AdminPackageRow = {
  id: number;
  name: string;
  asset: string;
  tier: string;
  price: number;
  returnPct: string;
  durationDays: number;
  popular: boolean;
  active: boolean;
};

const EMPTY: PackageInput = {
  name: "",
  asset: "Forex",
  tier: "Starter",
  price: 500000,
  returnPct: 1.5,
  durationDays: 30,
  popular: false,
  active: true,
};

export function PackagesManager({ packages }: { packages: AdminPackageRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminPackageRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<PackageInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setForm(EMPTY);
    setError(null);
    setCreating(true);
  }

  function openEdit(pkg: AdminPackageRow) {
    setForm({
      name: pkg.name,
      asset: pkg.asset,
      tier: pkg.tier,
      price: pkg.price,
      returnPct: Number(pkg.returnPct),
      durationDays: pkg.durationDays,
      popular: pkg.popular,
      active: pkg.active,
    });
    setError(null);
    setEditing(pkg);
  }

  function close() {
    setCreating(false);
    setEditing(null);
  }

  function submit() {
    if (!form.name.trim()) {
      setError("Nama paket wajib diisi");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        if (editing) {
          await adminUpdatePackage(editing.id, form);
        } else {
          await adminCreatePackage(form);
        }
        router.refresh();
        close();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan paket");
      }
    });
  }

  function toggleActive(pkg: AdminPackageRow) {
    startTransition(async () => {
      await adminTogglePackageActive(pkg.id, !pkg.active);
      router.refresh();
    });
  }

  const open = creating || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-strong"
        >
          <Plus className="size-4" />
          Tambah Paket
        </button>
      </div>

      <Panel className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Paket</th>
                <th className="px-5 py-3 font-medium">Kelas Aset</th>
                <th className="px-5 py-3 text-right font-medium">Modal</th>
                <th className="px-5 py-3 text-right font-medium">Return</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.tier} · {p.durationDays} hari{p.popular ? " · Populer" : ""}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.asset}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatIdr(p.price)}</td>
                  <td className="px-5 py-3 text-right text-emerald-500">{p.returnPct}%</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      disabled={isPending}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
                        p.active
                          ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/70",
                      )}
                    >
                      {p.active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      aria-label={`Edit ${p.name}`}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">{editing ? "Edit Paket EA" : "Tambah Paket EA"}</h3>
              <button
                type="button"
                onClick={close}
                aria-label="Tutup"
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Nama Paket</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Kelas Aset</label>
                  <select
                    value={form.asset}
                    onChange={(e) => setForm((f) => ({ ...f, asset: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  >
                    {["Forex", "Emas", "Kripto"].map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Tier</label>
                  <input
                    value={form.tier}
                    onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Modal (Rp)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Return (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.returnPct}
                    onChange={(e) => setForm((f) => ({ ...f, returnPct: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Durasi (hari)</label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={(e) => setForm((f) => ({ ...f, durationDays: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) => setForm((f) => ({ ...f, popular: e.target.checked }))}
                    className="size-4 rounded border-input accent-primary"
                  />
                  Populer
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                    className="size-4 rounded border-input accent-primary"
                  />
                  Aktif
                </label>
              </div>
            </div>

            {error ? (
              <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={isPending}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Menyimpan..." : "Simpan Paket"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
