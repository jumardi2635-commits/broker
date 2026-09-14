import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, MessageCircle, Send, Headset, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Bantuan | Genius fx" };

const channels = [
  { label: "WhatsApp", hint: "Respon cepat, 24 jam", icon: MessageCircle, href: "https://wa.me/" },
  { label: "Telegram", hint: "@CsGeniusFx", icon: Send, href: "https://t.me/CsGeniusFx" },
  { label: "Live Chat", hint: "Chat langsung dengan CS", icon: Headset, href: "#" },
];

export default function HelpPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <Link
          href="/dashboard"
          aria-label="Kembali"
          className="mt-0.5 rounded-lg border border-border bg-card p-2 text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Bantuan</h1>
          <p className="text-sm text-muted-foreground">
            Tim support Genius fx siap membantu Anda
          </p>
        </div>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {channels.map(({ label, hint, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
}
