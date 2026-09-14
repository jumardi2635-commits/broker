import type { Metadata } from "next";
import { Calendar, Download } from "lucide-react";
import { HistoryList } from "./history-list";

export const metadata: Metadata = { title: "Riwayat | Genius fx" };

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Riwayat</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground"
        >
          <Calendar className="size-4" />
          12 Agu 2026 – 11 Sep 2026
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground"
        >
          <Download className="size-4" />
          Ekspor
        </button>
      </div>

      <HistoryList />
    </div>
  );
}
