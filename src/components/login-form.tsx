"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";
import { SlideVerify } from "@/components/slide-verify";
import { authClient } from "@/lib/auth-client";
import { phoneToEmail } from "@/lib/phone";

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !password) {
      setMessage("Nomor HP dan kata sandi wajib diisi.");
      return;
    }
    if (!verified) {
      setMessage("Selesaikan verifikasi keamanan terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await authClient.signIn.email({
      email: phoneToEmail(phone),
      password,
    });

    setLoading(false);

    if (error) {
      setMessage("Nomor HP atau kata sandi salah.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Nomor HP
        </label>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Masukkan nomor HP Anda"
            className="h-13 w-full rounded-xl border border-input bg-secondary/40 py-3.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/25"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Kata Sandi
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi Anda"
            className="h-13 w-full rounded-xl border border-input bg-secondary/40 py-3.5 pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/25"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
      </div>

      <SlideVerify verified={verified} onVerified={setVerified} />

      {message ? (
        <p className="rounded-lg bg-accent/15 px-3 py-2 text-center text-xs text-accent-foreground">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-13 w-full rounded-xl bg-gradient-to-b from-primary to-primary-strong py-3.5 text-sm font-semibold tracking-wide text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.99] disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
