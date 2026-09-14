"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userProfile } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

function generateReferralCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export async function completeRegistration(phone: string, inviteCode?: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")

  const [existing] = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, session.user.id))
    .limit(1)
  if (existing) return

  let referredBy: string | null = null
  const trimmedInvite = inviteCode?.trim().toUpperCase()
  if (trimmedInvite) {
    const [referrer] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.referralCode, trimmedInvite))
      .limit(1)
    if (referrer) referredBy = referrer.userId
  }

  await db.insert(userProfile).values({
    userId: session.user.id,
    phone,
    referralCode: generateReferralCode(),
    referredBy,
    mainBalance: 0,
  })
}
