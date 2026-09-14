"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { updateProfileName } from "@/app/actions/profile";

export function ProfileEditButton({ currentName }: { currentName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        await updateProfileName(name);
        router.refresh();
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memperbarui profil");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary sm:ml-auto sm:mt-0"
      >
        Edit Profil
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Edit Profil</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            </div>

            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />

            {error ? (
              <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={isPending}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
