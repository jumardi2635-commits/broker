import { BadgeCheck, CheckCircle2, Landmark } from "lucide-react";
import { formatIdr, type WithdrawalProof } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ProofCard({ proof }: { proof: WithdrawalProof }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 px-4 pt-4">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white",
            proof.avatarColor,
          )}
        >
          {proof.id}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-sm font-semibold">
            Member {proof.memberMasked}
            <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label="Terverifikasi" />
          </p>
          <p className="text-xs text-muted-foreground">{proof.timeLabel}</p>
        </div>
      </div>

      <div className="mx-4 mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-900">
        <div className="divide-y divide-neutral-100">
          {proof.transactions.map((tx, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-600">
                <Landmark className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{tx.label}</p>
                <p className="truncate text-[11px] text-neutral-500">{tx.sublabel}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[11px] font-medium text-emerald-600">{tx.status}</p>
                <p className="text-xs font-bold text-violet-600">+{formatIdr(tx.amount)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5 border-t border-neutral-100 bg-emerald-50 py-2 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="size-3.5" />
          Transfer Berhasil
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 px-4 py-4 text-xs">
        <div>
          <dt className="text-muted-foreground">Jumlah</dt>
          <dd className="font-semibold text-emerald-500">Terverifikasi</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Metode</dt>
          <dd className="truncate font-semibold">{proof.method}</dd>
        </div>
        <div className="text-right">
          <dt className="text-muted-foreground">Waktu</dt>
          <dd className="font-semibold">{proof.dateTime}</dd>
        </div>
      </dl>
    </article>
  );
}
