import Link from "next/link";
import { ChevronLeft, Info, Plus, ShieldCheck } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { ForumFeed } from "@/components/dashboard/forum-feed";
import { withdrawalProofs } from "@/lib/mock-data";

export const metadata = { title: "Forum | Genius fx" };

export default function ForumPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard"
            aria-label="Kembali"
            className="mt-0.5 rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Bukti Penarikan</h1>
            <p className="text-sm text-muted-foreground">
              Bukti penarikan berhasil dari member Genius fx
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Informasi"
          className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info className="size-4" />
        </button>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        Unggah Bukti Penarikan
      </button>

      <Panel className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h2 className="text-sm font-bold">100% Pembayaran Nyata</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Semua bukti di bawah ini adalah penarikan nyata yang berhasil diproses.
          </p>
        </div>
      </Panel>

      <ForumFeed proofs={withdrawalProofs} />
    </div>
  );
}
