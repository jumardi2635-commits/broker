"use client";

import { Bell, Search, Settings, User } from "lucide-react";

export function AdminTopbar() {
  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users, transactions..."
              className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 hover:bg-secondary transition-colors">
            <Bell className="size-5 text-muted-foreground" />
            <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
          </button>
          <button className="rounded-lg p-2 hover:bg-secondary transition-colors">
            <Settings className="size-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3 border-l border-border pl-3">
            <div className="text-right">
              <p className="text-xs font-semibold">Admin User</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="size-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
