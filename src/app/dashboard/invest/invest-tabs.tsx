"use client";

import { useState } from "react";
import Link from "next/link";
import { PieChart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Investasi Aktif", "Riwayat Investasi", "Riwayat Profit"] as const;

export function InvestTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Riwayat Investasi");

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "flex-1 py-3 text-center text-xs font-semibold transition-colors",
              active === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <PieChart className="size-8 text-muted-foreground/40" />
        <p className="text-sm font-semibold">Belum ada data</p>
        <p className="text-xs text-muted-foreground">
          Pilih paket investasi terbaik untuk mulai menghasilkan
        </p>
        <Link
          href="/dashboard/market"
          className="mt-1 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" />
          Jelajahi Produk
        </Link>
      </div>
    </div>
  );
}
