import { BottomNav } from "@/components/dashboard/bottom-nav";
import { SupportButton } from "@/components/dashboard/support-button";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hex-backdrop min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col pb-24">
        <main className="flex-1 px-4 py-4">{children}</main>
      </div>
      <BottomNav />
      <SupportButton />
    </div>
  );
}
