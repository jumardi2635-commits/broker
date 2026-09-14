"use client";

import { Menu, Bell, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { account } from "@/lib/mock-data";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-6">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Buka menu"
        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden max-w-xs flex-1 md:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Cari instrumen..."
          className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifikasi"
          className="relative rounded-full border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" />
        </button>
        <div className="flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {account.name.charAt(0)}
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold">{account.name}</p>
            <p className="text-[10px] text-muted-foreground">{account.id}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
