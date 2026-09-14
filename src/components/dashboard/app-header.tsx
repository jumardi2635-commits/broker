"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { account } from "@/lib/mock-data";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-background/85 px-4 pb-3 pt-[max(env(safe-area-inset-top),0.75rem)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Selamat datang kembali,</p>
          <h1 className="truncate text-lg font-bold text-foreground">
            {account.name} <span aria-hidden>👋</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="size-4.5" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
          </button>
          <Link
            href="/dashboard/account"
            aria-label="Buka profil"
            className="grid size-9 place-items-center overflow-hidden rounded-full ring-2 ring-primary/30"
          >
            <Image src="/genius-fx-logo.jpg" alt="" width={36} height={36} className="size-full object-cover" />
          </Link>
        </div>
      </div>
    </header>
  );
}
