"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  eaPackage,
  investment,
  user,
  userProfile,
  walletTransaction,
  withdrawalProof,
} from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  if (session.user.role !== "admin") throw new Error("Forbidden")
  return session
}

// --- Overview ----------------------------------------------------------

export async function adminGetStats() {
  await requireAdmin()

  const [{ count: userCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)

  const [{ sum: balanceSum }] = await db
    .select({ sum: sql<number>`coalesce(sum(${userProfile.mainBalance}), 0)::int` })
    .from(userProfile)

  const [{ count: activeInvestments }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(investment)
    .where(eq(investment.status, "active"))

  const [{ sum: investedSum }] = await db
    .select({ sum: sql<number>`coalesce(sum(${investment.modal}), 0)::int` })
    .from(investment)
    .where(eq(investment.status, "active"))

  const [{ count: pendingCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(walletTransaction)
    .where(eq(walletTransaction.status, "pending"))

  return {
    userCount,
    totalUserBalance: balanceSum,
    activeInvestments,
    totalInvested: investedSum,
    pendingRequests: pendingCount,
  }
}

// --- Users ---------------------------------------------------------------

export async function adminListUsers() {
  await requireAdmin()

  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      banned: user.banned,
      createdAt: user.createdAt,
      mainBalance: userProfile.mainBalance,
      totalWithdrawn: userProfile.totalWithdrawn,
      referralCode: userProfile.referralCode,
    })
    .from(user)
    .leftJoin(userProfile, eq(userProfile.userId, user.id))
    .orderBy(desc(user.createdAt))
}

export async function adminAdjustUserBalance(userId: string, delta: number) {
  await requireAdmin()
  if (!Number.isFinite(delta) || delta === 0) throw new Error("Jumlah tidak valid")

  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)

  if (!profile) {
    await db.insert(userProfile).values({ userId, mainBalance: Math.max(0, Math.round(delta)) })
  } else {
    const next = Math.max(0, profile.mainBalance + Math.round(delta))
    await db.update(userProfile).set({ mainBalance: next }).where(eq(userProfile.userId, userId))
  }

  await db.insert(walletTransaction).values({
    userId,
    type: delta > 0 ? "bonus" : "withdrawal",
    amount: Math.abs(Math.round(delta)),
    status: "approved",
    method: "Penyesuaian Admin",
    note: "Saldo disesuaikan oleh admin",
    reviewedAt: new Date(),
    reviewedBy: "admin",
  })

  revalidatePath("/admin/users")
  revalidatePath("/dashboard")
}

export async function adminSetUserBanned(userId: string, banned: boolean) {
  await requireAdmin()
  await db.update(user).set({ banned, banReason: banned ? "Diblokir oleh admin" : null }).where(eq(user.id, userId))
  revalidatePath("/admin/users")
}

// --- Deposit / withdrawal approvals --------------------------------------

export async function adminListTransactions(status?: "pending" | "approved" | "rejected") {
  await requireAdmin()

  const rows = await db
    .select({
      id: walletTransaction.id,
      userId: walletTransaction.userId,
      type: walletTransaction.type,
      amount: walletTransaction.amount,
      status: walletTransaction.status,
      method: walletTransaction.method,
      note: walletTransaction.note,
      createdAt: walletTransaction.createdAt,
      userName: user.name,
      userEmail: user.email,
    })
    .from(walletTransaction)
    .leftJoin(user, eq(user.id, walletTransaction.userId))
    .where(status ? eq(walletTransaction.status, status) : sql`true`)
    .orderBy(desc(walletTransaction.createdAt))
    .limit(100)

  return rows
}

export async function adminReviewTransaction(id: number, action: "approve" | "reject") {
  const session = await requireAdmin()

  const [tx] = await db.select().from(walletTransaction).where(eq(walletTransaction.id, id)).limit(1)
  if (!tx) throw new Error("Transaksi tidak ditemukan")
  if (tx.status !== "pending") throw new Error("Transaksi sudah diproses")

  const newStatus = action === "approve" ? "approved" : "rejected"

  await db
    .update(walletTransaction)
    .set({ status: newStatus, reviewedAt: new Date(), reviewedBy: session.user.id })
    .where(eq(walletTransaction.id, id))

  if (action === "approve") {
    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, tx.userId))
      .limit(1)

    const balance = profile?.mainBalance ?? 0

    if (tx.type === "deposit") {
      if (!profile) {
        await db.insert(userProfile).values({ userId: tx.userId, mainBalance: tx.amount })
      } else {
        await db
          .update(userProfile)
          .set({ mainBalance: balance + tx.amount })
          .where(eq(userProfile.userId, tx.userId))
      }
    } else if (tx.type === "withdrawal") {
      if (balance < tx.amount) throw new Error("Saldo pengguna tidak cukup untuk penarikan ini")
      await db
        .update(userProfile)
        .set({
          mainBalance: balance - tx.amount,
          totalWithdrawn: (profile?.totalWithdrawn ?? 0) + tx.amount,
        })
        .where(eq(userProfile.userId, tx.userId))
    }
  }

  revalidatePath("/admin/transactions")
  revalidatePath("/dashboard/wallet")
  revalidatePath("/dashboard")
}

// --- EA Packages -----------------------------------------------------------

export async function adminListPackages() {
  await requireAdmin()
  return db.select().from(eaPackage).orderBy(eaPackage.price)
}

export type PackageInput = {
  name: string
  asset: string
  tier: string
  price: number
  returnPct: number
  durationDays: number
  popular: boolean
  active: boolean
}

export async function adminCreatePackage(data: PackageInput) {
  await requireAdmin()
  await db.insert(eaPackage).values({
    name: data.name,
    asset: data.asset,
    tier: data.tier,
    price: Math.round(data.price),
    returnPct: String(data.returnPct),
    durationDays: Math.round(data.durationDays),
    popular: data.popular,
    active: data.active,
  })
  revalidatePath("/admin/packages")
  revalidatePath("/dashboard/markets")
  revalidatePath("/dashboard/trade")
}

export async function adminUpdatePackage(id: number, data: PackageInput) {
  await requireAdmin()
  await db
    .update(eaPackage)
    .set({
      name: data.name,
      asset: data.asset,
      tier: data.tier,
      price: Math.round(data.price),
      returnPct: String(data.returnPct),
      durationDays: Math.round(data.durationDays),
      popular: data.popular,
      active: data.active,
    })
    .where(eq(eaPackage.id, id))
  revalidatePath("/admin/packages")
  revalidatePath("/dashboard/markets")
  revalidatePath("/dashboard/trade")
}

export async function adminTogglePackageActive(id: number, active: boolean) {
  await requireAdmin()
  await db.update(eaPackage).set({ active }).where(eq(eaPackage.id, id))
  revalidatePath("/admin/packages")
  revalidatePath("/dashboard/markets")
  revalidatePath("/dashboard/trade")
}

// --- Forum / withdrawal proof moderation -----------------------------------

export async function adminListWithdrawalProofs() {
  await requireAdmin()
  return db.select().from(withdrawalProof).orderBy(desc(withdrawalProof.createdAt))
}

export async function adminSetProofStatus(id: number, status: "visible" | "hidden") {
  await requireAdmin()
  await db.update(withdrawalProof).set({ status }).where(eq(withdrawalProof.id, id))
  revalidatePath("/admin/forum")
  revalidatePath("/dashboard/forum")
}

export async function adminDeleteProof(id: number) {
  await requireAdmin()
  await db.delete(withdrawalProof).where(eq(withdrawalProof.id, id))
  revalidatePath("/admin/forum")
  revalidatePath("/dashboard/forum")
}
