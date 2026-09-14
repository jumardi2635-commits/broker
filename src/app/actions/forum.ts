"use server"

import { db } from "@/lib/db"
import { withdrawalProof } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

export async function getWithdrawalProofs() {
  return db
    .select()
    .from(withdrawalProof)
    .where(eq(withdrawalProof.status, "visible"))
    .orderBy(desc(withdrawalProof.createdAt))
    .limit(50)
}
