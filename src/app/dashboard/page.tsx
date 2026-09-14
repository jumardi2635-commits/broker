import { ArrowUpRight, Wallet, TrendingUp, Layers, PiggyBank } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userProfile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { EquityChart } from "@/components/dashboard/equity-chart";
import { AllocationChart } from "@/components/dashboard/allocation-chart";
import { getActivePackages, getMyInvestments } from "@/app/actions/packages";
import { formatIdr } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata = { title: "Dashboard | Genius fx" };

function dailyReturn(pkg: { price: number; returnPct: string; durationDays: number }) {
  const total = pkg.price * (Number(pkg.returnPct) / 100);
  return Math.round(total / pkg.durationDays);
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const [profile] = userId
    ? await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1)
    : [];

  const [investments, packages] = await Promise.all([getMyInvestments(), getActivePackages()]);

  const mainBalance = profile?.mainBalance ?? 0;
  const totalInvestment = investments.reduce((sum, p) => sum + p.modal, 0);
  const todayProfit = investments.reduce((sum, p) => sum + dailyReturn(p.package), 0);
  const popular = packages.filter((p) => p.popular).slice(0, 5);

  const stats = [
    { label: "Saldo Utama", value: mainBalance, icon: Wallet },
    { label: "Profit EA Hari Ini", value: todayProfit, icon: TrendingUp },
    { label: "Total Investasi", value: totalInvestment, icon: Layers },
    { label: "Bonus Referral", value: 0, icon: PiggyBank },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Selamat datang kembali,</p>
          <h1 className="text-xl font-bold tracking-tight">{session?.user?.name ?? "Member"}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <span className="text-xs text-muted-foreground">Profit Hari Ini</span>
          <span className="flex items-center gap-1 text-sm font-bold text-emerald-500">
            <ArrowUpRight className="size-4" />
            {formatIdr(todayProfit)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Panel key={label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-lg font-bold tracking-tight">{formatIdr(value)}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Performa Portofolio" hint="7 hari terakhir" />
          <EquityChart />
        </Panel>
        <Panel>
          <PanelHeader title="Alokasi Portofolio" hint="Berdasarkan kelas aset" />
          <AllocationChart />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Paket EA Aktif" hint={`${investments.length} paket berjalan`} />
          {investments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada paket aktif. Beli paket EA di halaman Pasar untuk mulai berinvestasi.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Paket</th>
                    <th className="pb-2 font-medium">Kelas Aset</th>
                    <th className="pb-2 font-medium">Durasi</th>
                    <th className="pb-2 text-right font-medium">Modal</th>
                    <th className="pb-2 text-right font-medium">Profit/Hari</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 font-semibold">{p.package.name}</td>
                      <td>
                        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-xs font-semibold text-primary">
                          {p.package.asset}
                        </span>
                      </td>
                      <td className="text-muted-foreground">{p.package.durationDays} hari</td>
                      <td className="text-right text-muted-foreground">{formatIdr(p.modal)}</td>
                      <td className="text-right font-semibold text-emerald-500">
                        +{formatIdr(dailyReturn(p.package))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Produk Populer" hint="Paket EA favorit" />
          <ul className="space-y-1">
            {popular.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-secondary"
              >
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.asset}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatIdr(p.price)}</p>
                  <p className={cn("flex items-center justify-end gap-0.5 text-xs font-medium text-emerald-500")}>
                    <ArrowUpRight className="size-3" />
                    {p.returnPct}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
