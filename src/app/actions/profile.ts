"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { investment, userProfile } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session
}

export async function getProfile() {
  const session = await getSession()
  const userId = session.user.id

  const [profile] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)

  const activePackages = await db
    .select()
    .from(investment)
    .where(and(eq(investment.userId, userId), eq(investment.status, "active")))

  return {
    name: session.user.name,
    phone: profile?.phone ?? "",
    referralCode: profile?.referralCode ?? "",
    joined: profile?.createdAt ?? session.user.createdAt,
    activePackagesCount: activePackages.length,
  }
}

export async function updateProfileName(name: string) {
  await getSession()
  if (!name.trim()) throw new Error("Nama tidak boleh kosong")
  await auth.api.updateUser({
    headers: await headers(),
    body: { name: name.trim() },
  })
  revalidatePath("/dashboard/profile")
}
