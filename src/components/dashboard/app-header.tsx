"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { account } from "@/lib/mock-data";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">Selamat datang kembali,</p>
        <h1 className="truncate text-lg font-bold text-foreground">
          {account.name} <span aria-hidden>👋</span>
        </h1>
        <p className="text-sm text-muted-foreground">Siap trading lebih cerdas hari ini?</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifikasi"
          className="relative grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-4.5" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
        </button>
      </div>
      <Image
        src="/images/geniusfx-logo.png"
        alt="Genius fx"
        width={56}
        height={56}
        className="hidden size-14 shrink-0 rounded-xl object-cover sm:block"
      />
    </header>
  );
}
