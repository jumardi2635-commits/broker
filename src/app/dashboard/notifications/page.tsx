import { Bell, Gift, ArrowLeftRight, Settings2 } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { notifications, type NotificationItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata = { title: "Notifikasi | Genius fx" };

const typeIcon: Record<NotificationItem["type"], typeof Bell> = {
  Transaksi: ArrowLeftRight,
  Promo: Gift,
  Sistem: Settings2,
};

const typeStyle: Record<NotificationItem["type"], string> = {
  Transaksi: "bg-primary/15 text-primary",
  Promo: "bg-accent/20 text-accent-foreground",
  Sistem: "bg-secondary text-muted-foreground",
};

export default function NotificationsPage() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-sm text-muted-foreground">
            {unread > 0 ? `${unread} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          Tandai Semua Dibaca
        </button>
      </div>

      <Panel className="p-0">
        <ul className="divide-y divide-border">
          {notifications.map((n) => {
            const Icon = typeIcon[n.type];
            return (
              <li
                key={n.id}
                className={cn(
                  "flex gap-3 px-5 py-4 transition-colors hover:bg-secondary/50",
                  !n.read && "bg-primary/[0.03]",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full",
                    typeStyle[n.type],
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{n.title}</p>
                    {!n.read ? (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground/80">{n.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
