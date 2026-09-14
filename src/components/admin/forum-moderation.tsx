"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { adminDeleteProof, adminSetProofStatus } from "@/app/actions/admin";
import { formatIdr } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProofRow = {
  id: number;
  memberMasked: string;
  method: string;
  amount: number;
  label: string;
  status: string;
  createdAt: Date;
};

export function ForumModeration({ proofs }: { proofs: ProofRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleVisibility(id: number, status: string) {
    startTransition(async () => {
      await adminSetProofStatus(id, status === "visible" ? "hidden" : "visible");
      router.refresh();
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      await adminDeleteProof(id);
      router.refresh();
    });
  }

  return (
    <Panel className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Member</th>
              <th className="px-5 py-3 font-medium">Metode</th>
              <th className="px-5 py-3 text-right font-medium">Jumlah</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Tanggal</th>
              <th className="px-5 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {proofs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  Belum ada bukti penarikan.
                </td>
              </tr>
            ) : (
              proofs.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3 font-semibold">{p.memberMasked}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.method}</td>
                  <td className="px-5 py-3 text-right font-semibold">{formatIdr(p.amount)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        p.status === "visible"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {p.status === "visible" ? "Tampil" : "Disembunyikan"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{formatDateTime(p.createdAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleVisibility(p.id, p.status)}
                        disabled={isPending}
                        aria-label={p.status === "visible" ? "Sembunyikan" : "Tampilkan"}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {p.status === "visible" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        disabled={isPending}
                        aria-label="Hapus"
                        className="rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
