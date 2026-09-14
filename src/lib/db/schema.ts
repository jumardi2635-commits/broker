import {
  pgSchema,
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  serial,
} from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// These live in the `neon_auth` schema (already provisioned). Column names
// are camelCase to match Better Auth's defaults. Do not rename.

const neonAuth = pgSchema("neon_auth")

export const user = neonAuth.table("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
  phone: text("phone"),
})

export const session = neonAuth.table("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = neonAuth.table("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = neonAuth.table("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables (public schema) --------------------------------------------
// All app tables use a plain `userId` text column for per-user scoping
// (no FK — see neon-on-vercel skill). `getUserId()` + an explicit
// `eq(table.userId, userId)` in every query is the security boundary.

export const userProfile = pgTable("user_profile", {
  userId: text("userId").primaryKey(),
  phone: text("phone"),
  referralCode: text("referral_code"),
  referredBy: text("referred_by"),
  mainBalance: integer("main_balance").notNull().default(0),
  totalWithdrawn: integer("total_withdrawn").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const eaPackage = pgTable("ea_package", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  asset: text("asset").notNull(),
  tier: text("tier").notNull(),
  price: integer("price").notNull(),
  returnPct: numeric("return_pct").notNull(),
  durationDays: integer("duration_days").notNull(),
  popular: boolean("popular").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const investment = pgTable("investment", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  packageId: integer("package_id").notNull(),
  modal: integer("modal").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const walletTransaction = pgTable("wallet_transaction", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  type: text("type").notNull(), // deposit | withdrawal | bonus | profit
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  method: text("method"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by"),
})

export const withdrawalProof = pgTable("withdrawal_proof", {
  id: serial("id").primaryKey(),
  userId: text("userId"),
  memberMasked: text("member_masked").notNull(),
  method: text("method").notNull(),
  amount: integer("amount").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull().default("visible"), // visible | hidden
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
