"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CandlestickChart, Wallet, MessagesSquare, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/dashboard/markets", label: "Pasar", icon: CandlestickChart },
  { href: "/dashboard/wallet", label: "Dompet", icon: Wallet, center: true },
  { href: "/dashboard/forum", label: "Forum", icon: MessagesSquare },
  { href: "/dashboard/profile", label: "Profil", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md items-end justify-around border-t border-border bg-card/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur"
    >
      {items.map(({ href, label, icon: Icon, center }) => {
        const active =
          href === "/dashboard" ? pathname === href : pathname.startsWith(href);

        if (center) {
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center gap-1 -mt-6"
            >
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full bg-gradient-to-b from-primary to-primary-strong text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-card transition-transform active:scale-95",
                )}
              >
                <Icon className="size-6" />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("size-5", active && "stroke-[2.5]")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
