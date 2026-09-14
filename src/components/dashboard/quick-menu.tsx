import Link from "next/link";
import {
  LineChart,
  PieChart,
  Users,
  Gift,
  MessagesSquare,
  GraduationCap,
  History,
  Headphones,
} from "lucide-react";
import { quickMenu, type QuickMenuItem } from "@/lib/mock-data";

const icons: Record<QuickMenuItem["icon"], React.ComponentType<{ className?: string }>> = {
  market: LineChart,
  invest: PieChart,
  referral: Users,
  bonus: Gift,
  forum: MessagesSquare,
  edukasi: GraduationCap,
  history: History,
  help: Headphones,
};

export function QuickMenu() {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-tight">Menu Cepat</h2>
        <span className="text-xs font-medium text-primary">Akses Instan</span>
      </div>
      <div className="grid grid-cols-4 gap-y-4">
        {quickMenu.map(({ label, href, icon, badge }) => {
          const Icon = icons[icon];
          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <span className="relative grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
                {badge ? (
                  <span className="absolute -top-1.5 -right-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">
                    {badge}
                  </span>
                ) : null}
              </span>
              <span className="text-xs font-medium text-foreground">{label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
