import { adminListWithdrawalProofs } from "@/app/actions/admin";
import { ForumModeration } from "@/components/admin/forum-moderation";

export const metadata = { title: "Moderasi Forum | Admin Genius fx" };

export default async function AdminForumPage() {
  const proofs = await adminListWithdrawalProofs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Moderasi Bukti Penarikan</h1>
        <p className="text-sm text-muted-foreground">
          Sembunyikan atau hapus bukti penarikan yang tampil di forum pengguna.
        </p>
      </div>
      <ForumModeration proofs={proofs} />
    </div>
  );
}
