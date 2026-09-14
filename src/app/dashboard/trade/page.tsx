import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getActivePackages, getMyInvestments } from "@/app/actions/packages";
import { TradeTerminal } from "./trade-terminal";

export const metadata: Metadata = {
  title: "Trading Live — Genius fx",
};

export default async function TradePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [packages, investments] = await Promise.all([getActivePackages(), getMyInvestments()]);

  const [profile] = session?.user
    ? await db.select().from(userProfile).where(eq(userProfile.userId, session.user.id)).limit(1)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Trading Live</h1>
        <p className="text-sm text-muted-foreground">
          Pantau indeks performa EA secara real-time dan kelola paket investasi Anda.
        </p>
      </div>
      <TradeTerminal
        packages={packages}
        investments={investments}
        mainBalance={profile?.mainBalance ?? 0}
      />
    </div>
  );
}
