import type { Metadata } from "next";
import { MarketList } from "./market-list";

export const metadata: Metadata = { title: "Pasar | Genius fx" };

export default function MarketPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Produk</h1>
        <p className="text-sm text-muted-foreground">
          Jelajahi semua paket EA yang tersedia untuk diinvestasikan.
        </p>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-primary-strong to-primary p-4 text-primary-foreground">
        <p className="text-lg font-bold">Trading 100+ Produk</p>
        <p className="text-sm opacity-80">Pasar global. Satu platform.</p>
      </div>

      <MarketList />
    </div>
  );
}
