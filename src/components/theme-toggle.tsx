"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
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
