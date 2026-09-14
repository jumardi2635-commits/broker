"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Aktifkan mode gelap"
      onClick={toggle}
      className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 shadow-sm"
    >
      <Sun className="size-4 text-accent" aria-hidden />
      <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary/25 transition-colors">
        <span
          className={`absolute size-4 rounded-full bg-primary shadow transition-transform ${
            isDark ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      <Moon className="size-4 text-muted-foreground" aria-hidden />
    </button>
  );
}
