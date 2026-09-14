import { marketTicker } from "@/lib/mock-data";

export function MarqueeTicker() {
  const text = marketTicker.join("     •     ");
  return (
    <div className="overflow-hidden rounded-lg bg-primary/10 py-2">
      <div className="animate-marquee whitespace-nowrap text-xs font-medium text-primary">
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
}
