import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegisterForm } from "@/components/register-form";
import { RegulatorBadges } from "@/components/regulator-badges";

export default function RegisterPage() {
  return (
    <main className="hex-backdrop flex min-h-screen flex-col items-center px-4 py-6">
      <div className="mb-6 flex w-full max-w-md justify-end">
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-8 pb-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-2xl border border-border bg-card p-1.5 shadow-lg shadow-primary/10">
            <Image
              src="/images/geniusfx-logo.png"
              alt="Genius fx"
              width={96}
              height={96}
              className="size-24 rounded-xl object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Genius <span className="text-accent">fx</span>
          </h1>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">
            TRADING CERDAS.{" "}
            <span className="text-accent">HASIL MAKSIMAL.</span>
          </p>
        </header>

        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-2xl font-bold text-foreground">Buat Akun</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Daftar untuk memulai perjalanan trading Anda
          </p>
        </div>

        <div className="w-full">
          <RegisterForm />
        </div>

        <div className="w-full">
          <RegulatorBadges />
        </div>

        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/"
            className="font-semibold text-accent underline-offset-4 hover:underline"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
