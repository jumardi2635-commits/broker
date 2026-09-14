import { BarChart3, Users, TrendingUp, AlertCircle, Activity, PieChart } from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminUserTable } from "@/components/admin/admin-user-table";
import { AdminMetrics } from "@/components/admin/admin-metrics";
import { AdminAlerts } from "@/components/admin/admin-alerts";
import { formatUsd } from "@/lib/mock-data";

export const metadata = { title: "Admin Panel | Genius fx" };

const topStats = [
  { label: "Total Users", value: 1254, icon: Users, change: "+12%" },
  { label: "Total Trading Volume", value: formatUsd(2450000), icon: BarChart3, change: "+8.2%" },
  { label: "Platform Revenue", value: formatUsd(125400), icon: TrendingUp, change: "+23.5%" },
  { label: "Active Traders", value: 456, icon: Activity, change: "+5.4%" },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Administrator</p>
          <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <AlertCircle className="size-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-500">3 Alerts</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {topStats.map(({ label, value, icon: Icon, change }) => (
          <Panel key={label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-lg font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-500">{change}</p>
          </Panel>
        ))}
      </div>

      {/* Charts & Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Platform Metrics" hint="Last 30 days" />
          <AdminMetrics />
        </Panel>
        <Panel>
          <PanelHeader title="System Alerts" hint="Active" />
          <AdminAlerts />
        </Panel>
      </div>

      {/* User Management */}
      <Panel>
        <PanelHeader title="User Management" hint="Recent users" />
        <AdminUserTable />
      </Panel>
    </div>
  );
}
