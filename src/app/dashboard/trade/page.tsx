import type { Metadata } from "next";
import { TradeTerminal } from "./trade-terminal";

export const metadata: Metadata = {
  title: "Trading — Genius fx",
};

export default function TradePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Trading Terminal</h1>
        <p className="text-sm text-muted-foreground">
          Buka posisi demo dan pantau P&L secara real-time.
        </p>
      </div>
      <TradeTerminal />
    </div>
  );
}
