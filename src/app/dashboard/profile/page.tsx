import {
  BadgeCheck,
  Phone,
  Calendar,
  Shield,
  Gift,
  KeyRound,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import { Panel, PanelHeader } from "@/components/dashboard/panel";
import { account } from "@/lib/mock-data";

export const metadata = { title: "Profil | Genius fx" };

const details = [
  { label: "Nomor Telepon", value: account.phone, icon: Phone },
  { label: "Tanggal Bergabung", value: account.joined, icon: Calendar },
  { label: "ID Akun", value: account.id, icon: Shield },
  { label: "Kode Referral", value: account.referralCode, icon: Gift },
];

const security = [
  { label: "Ubah Kata Sandi", hint: "Terakhir diubah 3 bulan lalu", icon: KeyRound },
  { label: "Autentikasi Dua Faktor", hint: "Aktif via aplikasi", icon: Smartphone },
  { label: "Verifikasi Identitas (KYC)", hint: "Terverifikasi", icon: BadgeCheck },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Profil</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun dan pengaturan keamanan Anda.
        </p>
      </div>

      <Panel>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <span className="grid size-20 place-items-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground">
            {account.name.charAt(0)}
          </span>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-lg font-bold">{account.name}</h2>
              {account.verified ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500">
                  <BadgeCheck className="size-3.5" />
                  Terverifikasi
                </span>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{account.phone}</p>
            <span className="mt-2 inline-block rounded-full bg-accent/20 px-3 py-0.5 text-xs font-semibold text-accent-foreground">
              {account.activePackages} Paket Aktif
            </span>
          </div>
          <button
            type="button"
            className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary sm:ml-auto sm:mt-0"
          >
            Edit Profil
          </button>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Informasi Akun" />
          <ul className="space-y-3">
            {details.map(({ label, value, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2.5"
              >
                <Icon className="size-4 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="truncate text-sm font-semibold">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader title="Keamanan" />
          <ul className="space-y-2">
            {security.map(({ label, hint, icon: Icon }) => (
              <li key={label}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg border border-border/60 px-3 py-3 text-left transition-colors hover:bg-secondary"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
