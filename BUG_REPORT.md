# Bug Report - Genius fx Platform

## Critical Issues Found

### 1. **Database Connection Missing** 🔴 CRITICAL
**File:** `src/lib/db/index.ts`
**Status:** Not implemented
**Impact:** Application will crash on startup

The database pool is imported but never defined. The auth system and all server actions depend on this.

**Issue:**
```typescript
// src/lib/auth.ts
import { pool } from "@/lib/db"
export const auth = betterAuth({
  database: pool,  // ❌ pool is undefined!
  // ...
})
```

**Solution Needed:**
```typescript
// src/lib/db/index.ts - This file needs implementation
import { Pool } from "pg"

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
```

---

### 2. **Invalid Transaction Type in Package Purchase** 🟠 HIGH
**File:** `src/app/actions/packages.ts` (Lines 67-75)
**Status:** Logic error

The transaction type is set to `"profit"` when it should be `"investment"` or `"purchase"`.

**Current Code:**
```typescript
await db.insert(walletTransaction).values({
  userId,
  type: "profit",  // ❌ WRONG! This is an investment/purchase, not profit
  amount: -pkg.price,
  status: "approved",
  method: "Saldo Utama",
  note: `Pembelian paket ${pkg.name}`,
  reviewedAt: new Date(),
})
```

**Expected Types (from schema):**
- `"deposit"` - Money in
- `"withdrawal"` - Money out
- `"bonus"` - Free money/incentive
- `"profit"` - Investment returns ← WRONG TYPE FOR PURCHASE

**Fix:** Change `type: "profit"` to `type: "withdrawal"` or add `"investment"` as valid type.

---

### 3. **Wallet Page Type Label Mismatch** 🟠 HIGH
**File:** `src/app/dashboard/wallet/page.tsx` (Lines 11-22)
**Status:** Inconsistent display

The wallet page expects transaction type `"profit"` but displays it as `"Investasi"` (Investment). This creates confusion since actual profits aren't recorded separately.

**Current Code:**
```typescript
const typeLabel: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Penarikan",
  bonus: "Bonus",
  profit: "Investasi",  // ❌ Confusing - profit is not "investasi"
};
```

**Issue:** When a package is purchased, it's recorded as `type: "profit"` (wrong), then displayed as "Investasi" (confusing).

---

### 4. **Wallet Transaction Color Coding Logic Error** 🟡 MEDIUM
**File:** `src/app/dashboard/wallet/page.tsx` (Lines 104-113)
**Status:** Incorrect conditional

The code treats `"profit"` as an outflow (negative), but profits should be inflows (positive).

**Current Code:**
```typescript
tx.type === "withdrawal" || tx.type === "profit"
  ? "text-destructive"      // ❌ Shows as RED (negative)
  : "text-emerald-500",     // Shows as GREEN (positive)
```

**Issue:** Since `type: "profit"` is used for package purchases (outflows), it correctly shows as red by accident, but semantically this is wrong. When actual profit returns are added, they'll be displayed incorrectly.

---

### 5. **Missing Database Schema Implementation** 🔴 CRITICAL
**File:** `src/lib/db/index.ts`
**Status:** Not implemented

While schema tables are defined in `schema.ts`, the database connection pool is never created.

**Required Implementation:**
```typescript
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })
```

---

### 6. **Admin Page Not Protected** 🟡 MEDIUM
**File:** `src/app/admin/layout.tsx`
**Status:** Missing authentication check

The admin layout doesn't verify that the user has an `"admin"` role.

**Current:** No role verification visible in the layout file.

**Fix Needed:**
```typescript
export default async function AdminLayout() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user?.role !== "admin") {
    redirect("/dashboard")
  }
  // ...
}
```

---

### 7. **Phone Normalization Not Applied Consistently** 🟡 MEDIUM
**File:** `src/components/register-form.tsx` & `src/components/login-form.tsx`
**Status:** Potential issue

Phone input accepts any format but isn't normalized before being stored. This can cause duplicate accounts with variations like `628123456789`, `+628123456789`, `08123456789`.

**Issue:**
```typescript
await authClient.signUp.email({
  email: phoneToEmail(phone),  // phoneToEmail normalizes, but...
  name: phone,  // ❌ This stores raw phone format
})

// Then later:
await completeRegistration(phone, inviteCode)  // Raw phone stored in userProfile
```

**Fix:**
```typescript
const normalizedPhone = normalizePhone(phone)
await completeRegistration(normalizedPhone, inviteCode)
```

---

### 8. **Missing Database Initialization Migration** 🔴 CRITICAL
**File:** Root level
**Status:** No migration system found

There's no visible database migration setup. Better Auth tables in `neon_auth` schema and app tables need to be created.

**Required:** Add Drizzle migration setup
```bash
npm run db:migrate
```

This command is missing from package.json.

---

### 9. **Type Casting Issue in Dashboard** 🟡 MEDIUM
**File:** `src/app/dashboard/page.tsx` (Line 25-26)
**Status:** Potential destructuring error

```typescript
const [profile] = userId
  ? await db.select().from(userProfile).where(eq(userProfile.userId, userId)).limit(1)
  : []  // ❌ Returns array when no userId, but then destructures [profile]
```

If no `userId` exists, this sets `profile` to `undefined` from empty array destructuring, which works but is fragile.

---

### 10. **SlideVerify Component Missing** 🔴 CRITICAL
**File:** `src/components/slide-verify.tsx`
**Status:** File not found/incomplete

Both LoginForm and RegisterForm import `SlideVerify` component, but implementation is missing or incomplete.

**Used in:**
- `src/components/login-form.tsx` (Line 6)
- `src/components/register-form.tsx` (Line 6)

**Fix:** Implement the component or remove the verification requirement.

---

### 11. **No Error Handling in Auth Actions** 🟡 MEDIUM
**File:** `src/app/actions/auth.ts` (Line 66-70)
**Status:** Silent failures

```typescript
try {
  await completeRegistration(phone, inviteCode)
} catch {
  // ❌ Error is silently ignored - user can't see what went wrong
}
```

Users won't know if profile creation failed.

---

### 12. **Hardcoded Base URLs Incomplete** 🟡 MEDIUM
**File:** `src/lib/auth.ts` (Lines 8-13)
**Status:** Incomplete environment handling

The `baseURL` logic doesn't have a fallback for local development without special environment variables.

```typescript
baseURL:
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? ... : ...)
  // ❌ Returns undefined in local dev if VERCEL_* not set
```

Should default to `http://localhost:3000` for development.

---

## Testing Checklist

### Authentication Flow
- [ ] User can register with phone number
- [ ] User can login with correct credentials
- [ ] Login fails with wrong password
- [ ] Duplicate phone number shows error
- [ ] Slide verification works
- [ ] User redirected to /dashboard on successful login
- [ ] User redirected to /admin if admin role

### Dashboard
- [ ] Dashboard loads and shows user name
- [ ] Main balance displays correctly
- [ ] Active packages show correctly
- [ ] Daily profit calculation is accurate
- [ ] Charts render without errors

### Wallet
- [ ] Wallet balance displays correctly
- [ ] Transaction history shows all transactions
- [ ] Transaction types display correct labels
- [ ] Colors match transaction direction
- [ ] Deposit/Withdrawal UI functions

### Package Purchase
- [ ] Can view available packages
- [ ] Cannot buy package with insufficient balance
- [ ] After purchase, balance decreases
- [ ] Investment appears in active packages
- [ ] Transaction appears in wallet history
- [ ] Transaction type shows correctly

### Admin
- [ ] Admin user can access /admin
- [ ] Non-admin users redirected from /admin
- [ ] Forum moderation loads
- [ ] Packages manager loads
- [ ] Users table loads
- [ ] Transactions table loads

---

## Priority Fixes

### 🔴 CRITICAL (Block deployment)
1. Implement `src/lib/db/index.ts` with pool connection
2. Implement database migrations
3. Implement `SlideVerify` component or remove verification

### 🟠 HIGH (Fix soon)
4. Change transaction type from "profit" to "withdrawal" for purchases
5. Add admin role check to admin layout
6. Fix wallet transaction type labeling

### 🟡 MEDIUM (Fix before launch)
7. Implement error handling in registration
8. Normalize phone consistently
9. Fix base URL fallback
10. Add better error messages

---

**Generated:** 2026-09-11
**Repository:** jumardi2635-commits/ai-website-cloner-template
