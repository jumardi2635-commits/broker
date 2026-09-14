"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userProfile, walletTransaction } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function getWalletData() {
  const userId = await getUserId()

  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)

  const transactions = await db
    .select()
    .from(walletTransaction)
    .where(eq(walletTransaction.userId, userId))
    .orderBy(desc(walletTransaction.createdAt))
    .limit(50)

  return {
    mainBalance: profile?.mainBalance ?? 0,
    totalWithdrawn: profile?.totalWithdrawn ?? 0,
    transactions,
  }
}

export async function requestDeposit(amount: number, method: string) {
  const userId = await getUserId()
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Jumlah tidak valid")
  if (!method) throw new Error("Metode pembayaran wajib diisi")

  await db.insert(walletTransaction).values({
    userId,
    type: "deposit",
    amount: Math.round(amount),
    status: "pending",
    method,
  })

  revalidatePath("/dashboard/wallet")
}

export async function requestWithdrawal(amount: number, method: string) {
  const userId = await getUserId()
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Jumlah tidak valid")
  if (!method) throw new Error("Metode penarikan wajib diisi")

  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)

  const balance = profile?.mainBalance ?? 0
  if (Math.round(amount) > balance) throw new Error("Saldo tidak cukup")

  await db.insert(walletTransaction).values({
    userId,
    type: "withdrawal",
    amount: Math.round(amount),
    status: "pending",
    method,
  })

  revalidatePath("/dashboard/wallet")
}
