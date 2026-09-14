"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { eaPackage, investment, userProfile, walletTransaction } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function getActivePackages() {
  return db
    .select()
    .from(eaPackage)
    .where(eq(eaPackage.active, true))
    .orderBy(eaPackage.price)
}

export async function getMyInvestments() {
  const userId = await getUserId()
  return db
    .select({
      id: investment.id,
      modal: investment.modal,
      status: investment.status,
      createdAt: investment.createdAt,
      package: eaPackage,
    })
    .from(investment)
    .innerJoin(eaPackage, eq(investment.packageId, eaPackage.id))
    .where(and(eq(investment.userId, userId), eq(investment.status, "active")))
    .orderBy(desc(investment.createdAt))
}

export async function buyPackage(packageId: number) {
  const userId = await getUserId()

  const [pkg] = await db.select().from(eaPackage).where(eq(eaPackage.id, packageId)).limit(1)
  if (!pkg || !pkg.active) throw new Error("Paket tidak tersedia")

  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)

  const balance = profile?.mainBalance ?? 0
  if (balance < pkg.price) throw new Error("Saldo tidak cukup untuk membeli paket ini")

  await db
    .update(userProfile)
    .set({ mainBalance: balance - pkg.price })
    .where(eq(userProfile.userId, userId))

  await db.insert(investment).values({
    userId,
    packageId: pkg.id,
    modal: pkg.price,
    status: "active",
  })

  await db.insert(walletTransaction).values({
    userId,
    type: "profit",
    amount: -pkg.price,
    status: "approved",
    method: "Saldo Utama",
    note: `Pembelian paket ${pkg.name}`,
    reviewedAt: new Date(),
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/trade")
  revalidatePath("/dashboard/markets")
  revalidatePath("/dashboard/wallet")
}
