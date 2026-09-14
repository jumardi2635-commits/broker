import Link from "next/link";
import { liveActivities, formatIdr } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function LiveActivity() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-tight">
          Aktivitas Live
          <span className="size-2 rounded-full bg-emerald-500" />
        </h2>
        <Link href="/dashboard/forum" className="text-xs font-semibold text-primary">
          Forum
        </Link>
      </div>
      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {liveActivities.map((a) => {
          const isWithdraw = a.action === "tarik dana";
          return (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                U
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  <span className="font-semibold">{a.masked}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{a.ago}</p>
              </div>
              <p
                className={cn(
                  "shrink-0 text-sm font-bold",
                  isWithdraw ? "text-accent" : "text-emerald-500",
                )}
              >
                {formatIdr(a.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
