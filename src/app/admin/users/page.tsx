import { adminListUsers } from "@/app/actions/admin";
import { UsersTable } from "@/components/admin/users-table";

export const metadata = { title: "Kelola Pengguna | Admin Genius fx" };

export default async function AdminUsersPage() {
  const users = await adminListUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Kelola Pengguna</h1>
        <p className="text-sm text-muted-foreground">
          Lihat saldo pengguna, sesuaikan saldo secara manual, dan blokir akun bila diperlukan.
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
