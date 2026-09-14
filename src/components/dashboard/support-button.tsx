"use client";

import { Headset } from "lucide-react";

export function SupportButton() {
  return (
    <a
      href="https://t.me/CsGeniusFx"
      target="_blank"
      rel="noreferrer"
      aria-label="Hubungi customer service"
      className="fixed bottom-24 right-4 z-40 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
    >
      <Headset className="size-5" />
    </a>
  );
}
