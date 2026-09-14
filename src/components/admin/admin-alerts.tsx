"use client";

import { AlertCircle, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    title: "High Trading Volume",
    description: "Trading volume increased by 45% today",
    icon: TrendingUp,
    severity: "info",
  },
  {
    id: 2,
    title: "New User Registration",
    description: "125 new users joined in the last 24 hours",
    icon: Users,
    severity: "success",
  },
  {
    id: 3,
    title: "System Maintenance",
    description: "Scheduled maintenance in 6 hours",
    icon: AlertTriangle,
    severity: "warning",
  },
];

export function AdminAlerts() {
  return (
    <ul className="space-y-2">
      {alerts.map(({ id, title, description, icon: Icon, severity }) => (
        <li
          key={id}
          className={cn(
            "rounded-lg border p-3 text-sm",
            severity === "info" && "border-primary/30 bg-primary/10",
            severity === "success" && "border-emerald-500/30 bg-emerald-500/10",
            severity === "warning" && "border-amber-500/30 bg-amber-500/10"
          )}
        >
          <div className="flex items-start gap-2">
            <Icon className={cn(
              "size-4 mt-0.5 flex-shrink-0",
              severity === "info" && "text-primary",
              severity === "success" && "text-emerald-500",
              severity === "warning" && "text-amber-500"
            )} />
            <div className="flex-1">
              <p className="font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
