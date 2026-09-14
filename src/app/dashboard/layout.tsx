import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/");
  if (session.user.banned) redirect("/");
  if (session.user.role === "admin") redirect("/admin");

  return (
    <DashboardShell
      user={{
        name: session.user.name,
        phone: session.user.name,
      }}
    >
      {children}
    </DashboardShell>
  );
}
