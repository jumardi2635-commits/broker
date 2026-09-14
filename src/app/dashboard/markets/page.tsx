import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getActivePackages } from "@/app/actions/packages";
import { MarketsTable } from "@/components/dashboard/markets-table";

export const metadata = { title: "Pasar | Genius fx" };

export default async function MarketsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const packages = await getActivePackages();

  const [profile] = session?.user
    ? await db.select().from(userProfile).where(eq(userProfile.userId, session.user.id)).limit(1)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Pasar</h1>
        <p className="text-sm text-muted-foreground">
          Jelajahi semua paket EA yang tersedia untuk diinvestasikan.
        </p>
      </div>

      <MarketsTable packages={packages} mainBalance={profile?.mainBalance ?? 0} />
    </div>
  );
}
