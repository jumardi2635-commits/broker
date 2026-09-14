import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ReferralCta() {
  return (
    <Link
      href="/dashboard/bonus"
      className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4"
    >
      <span className="text-2xl" aria-hidden>
        🎁
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">Ajak teman, dapat komisi!</p>
        <p className="text-xs text-muted-foreground">
          Program referral hingga 32% · bonus langsung cair
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
