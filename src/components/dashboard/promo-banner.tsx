import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PromoBanner({
  href,
  icon,
  eyebrow,
  title,
  subtitle,
}: {
  href: string;
  icon: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary-strong to-primary p-4 text-primary-foreground shadow-lg shadow-primary/25"
    >
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">{eyebrow}</p>
        <p className="truncate text-sm font-bold">{title}</p>
        <p className="truncate text-xs opacity-80">{subtitle}</p>
      </div>
      <ChevronRight className="size-5 shrink-0 opacity-80" />
    </Link>
  );
}
