"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Gift, Lock, Phone } from "lucide-react";
import { SlideVerify } from "@/components/slide-verify";
import { authClient } from "@/lib/auth-client";
import { phoneToEmail } from "@/lib/phone";
import { completeRegistration } from "@/app/actions/auth";

export function RegisterForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !password) {
      setMessage("Nomor HP dan kata sandi wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (password.length < 8) {
      setMessage("Kata sandi minimal 8 karakter.");
      return;
    }
    if (!agreed) {
      setMessage("Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi.");
      return;
    }
    if (!verified) {
      setMessage("Selesaikan verifikasi keamanan terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await authClient.signUp.email({
      email: phoneToEmail(phone),
      password,
      name: phone,
    });

    if (error) {
      setLoading(false);
      setMessage(
        error.message?.includes("already exists")
          ? "Nomor HP ini sudah terdaftar."
          : "Gagal mendaftar. Coba lagi.",
      );
      return;
    }

    try {
      await completeRegistration(phone, inviteCode);
    } catch {
      // Profile creation failure shouldn't block access; it can be retried later.
    }

    setLoading(false);
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
            autoComplete="new-password"
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

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Konfirmasi Kata Sandi
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Konfirmasi kata sandi Anda"
            className="h-13 w-full rounded-xl border border-input bg-secondary/40 py-3.5 pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/25"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="inviteCode" className="text-sm font-medium text-foreground">
          Kode undangan <span className="text-muted-foreground">(opsional)</span>
        </label>
        <div className="relative">
          <Gift className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="inviteCode"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="KODE UNDANGAN"
            className="h-13 w-full rounded-xl border border-input bg-secondary/40 py-3.5 pl-11 pr-4 text-sm uppercase tracking-wide outline-none transition-colors placeholder:tracking-wide placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/25"
          />
        </div>
      </div>

      <label htmlFor="agree" className="flex cursor-pointer items-start gap-2.5 text-sm text-foreground">
        <input
          id="agree"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
        />
        <span className="text-pretty">
          Saya setuju dengan{" "}
          <span className="font-semibold text-primary">Syarat &amp; Ketentuan</span> dan{" "}
          <span className="font-semibold text-primary">Kebijakan Privasi</span>
        </span>
      </label>

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
        {loading ? "Memproses..." : "Daftar"}
      </button>
    </form>
  );
}
