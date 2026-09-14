"use client";

import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const mockUsers = [
  {
    id: 1,
    name: "Ahmad Suryanto",
    email: "ahmad@example.com",
    status: "active",
    joinDate: "2024-01-15",
    tradingVolume: "$45,230",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti@example.com",
    status: "active",
    joinDate: "2024-02-20",
    tradingVolume: "$32,100",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi@example.com",
    status: "inactive",
    joinDate: "2024-01-10",
    tradingVolume: "$15,500",
  },
  {
    id: 4,
    name: "Ratna Wijaya",
    email: "ratna@example.com",
    status: "active",
    joinDate: "2024-03-05",
    tradingVolume: "$68,900",
  },
];

export function AdminUserTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="pb-3 font-medium">Name</th>
            <th className="pb-3 font-medium">Email</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Join Date</th>
            <th className="pb-3 text-right font-medium">Trading Volume</th>
            <th className="pb-3 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user) => (
            <tr key={user.id} className="border-b border-border/60 hover:bg-secondary/30 transition-colors">
              <td className="py-3 font-semibold">{user.name}</td>
              <td className="py-3 text-muted-foreground text-xs">{user.email}</td>
              <td className="py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-xs font-semibold",
                    user.status === "active"
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-3 text-muted-foreground">{user.joinDate}</td>
              <td className="py-3 text-right font-semibold">{user.tradingVolume}</td>
              <td className="py-3 text-right">
                <button className="inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-secondary transition-colors">
                  <MoreHorizontal className="size-4 text-muted-foreground" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
