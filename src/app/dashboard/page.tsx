import { AppHeader } from "@/components/dashboard/app-header";
import { MarqueeTicker } from "@/components/dashboard/marquee-ticker";
import { WalletSummaryCard } from "@/components/dashboard/wallet-summary-card";
import { QuickMenu } from "@/components/dashboard/quick-menu";
import { PromoBanner } from "@/components/dashboard/promo-banner";
import { StatsStrip } from "@/components/dashboard/stats-strip";
import { MarketSummary } from "@/components/dashboard/market-summary";
import { Watchlist } from "@/components/dashboard/watchlist";
import { LiveActivity } from "@/components/dashboard/live-activity";
import { ReferralCta } from "@/components/dashboard/referral-cta";

export const metadata = { title: "Beranda | Genius fx" };

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <AppHeader />
      <MarqueeTicker />
      <WalletSummaryCard />
      <QuickMenu />
      <PromoBanner
        href="/dashboard/invest"
        icon="🎁"
        eyebrow="Promo Spesial"
        title="Mulai investasi EA dari Rp 50.000"
        subtitle="Profit harian otomatis · kontrak fleksibel"
      />
      <StatsStrip />
      <MarketSummary />
      <Watchlist />
      <LiveActivity />
      <ReferralCta />
    </div>
  );
}
