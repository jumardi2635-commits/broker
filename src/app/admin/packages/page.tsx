import { adminListPackages } from "@/app/actions/admin";
import { PackagesManager } from "@/components/admin/packages-manager";

export const metadata = { title: "Paket EA | Admin Genius fx" };

export default async function AdminPackagesPage() {
  const packages = await adminListPackages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Kelola Paket EA</h1>
        <p className="text-sm text-muted-foreground">
          Tambah, ubah, dan aktifkan/nonaktifkan paket EA yang tersedia untuk pengguna.
        </p>
      </div>
      <PackagesManager packages={packages} />
    </div>
  );
}
