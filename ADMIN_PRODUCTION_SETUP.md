# 🔐 Admin Production Setup Guide

Panduan lengkap untuk setup Admin Dashboard di production (Vercel).

---

## 🚀 Quick Setup

### 1. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy output untuk `NEXTAUTH_SECRET`.

---

### 2. Set Environment Variables di Vercel

Go to **Vercel Dashboard** → **Admin Project** → **Settings** → **Environment Variables**

```env
# API Backend
NEXT_PUBLIC_API_URL=https://mutualist-api.vercel.app/api

# Supabase (for file uploads)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth
NEXTAUTH_URL=https://mutualist-admin.vercel.app
NEXTAUTH_SECRET=your-generated-secret-from-step-1

# Admin Credentials (IMPORTANT: Change these!)
ADMIN_EMAIL=admin@mutualist.co
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Mutualist Admin
```

---

## 🔐 Security Best Practices

### 1. Change Default Credentials

**NEVER use default credentials in production!**

```env
# ❌ BAD (Default)
ADMIN_EMAIL=admin@mutualist.co
ADMIN_PASSWORD=admin123

# ✅ GOOD (Custom)
ADMIN_EMAIL=your-email@company.com
ADMIN_PASSWORD=Str0ng!P@ssw0rd#2024
```

### 2. Use Strong Password

Requirements:

- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not a common word or pattern

Generate strong password:

```bash
openssl rand -base64 16
```

### 3. Rotate Credentials Regularly

- Change password every 3-6 months
- Update `NEXTAUTH_SECRET` annually
- Keep backup of old credentials during transition

---

## 🌐 NextAuth Configuration

### Environment Variables Explained

**NEXTAUTH_URL**

- Development: **Leave empty/commented** (auto-detected with `trustHost: true`)
- Production: `https://your-admin-domain.vercel.app` (required)
- Must match your actual domain in production
- If not set in dev, NextAuth will use the current request URL

**NEXTAUTH_SECRET**

- Used to encrypt JWT tokens
- Must be at least 32 characters
- Keep it secret, never commit to git

**ADMIN_EMAIL / ADMIN_PASSWORD**

- Your login credentials
- Stored as environment variables (not in database)
- Can be changed anytime via Vercel dashboard

---

## 🔄 Callback URL Configuration

NextAuth automatically handles callback URLs based on `NEXTAUTH_URL`.

**Automatic URLs:**

- Sign in: `https://your-domain.vercel.app/api/auth/signin`
- Callback: `https://your-domain.vercel.app/api/auth/callback/credentials`
- Sign out: `https://your-domain.vercel.app/api/auth/signout`

**No manual configuration needed!** ✅

---

## 🧪 Testing Production Auth

### 1. Test Login Flow

1. Go to `https://your-admin-domain.vercel.app/login`
2. Enter credentials from environment variables
3. Should redirect to dashboard (`/`)
4. Check session is maintained on refresh

### 2. Test Logout

1. Click logout button
2. Should redirect to `/login`
3. Try accessing `/` - should redirect to login

### 3. Test Protected Routes

```bash
# Without auth - should redirect to login
curl https://your-admin-domain.vercel.app/portfolios

# With auth - should show content
# (Need to test in browser with session)
```

---

## 🐛 Troubleshooting

### Issue 1: Redirect to localhost after login

**Cause:** `NEXTAUTH_URL` not set or incorrect

**Solution:**

```env
# ❌ Wrong
NEXTAUTH_URL=http://localhost:3001

# ✅ Correct (Production)
NEXTAUTH_URL=https://mutualist-admin.vercel.app
```

Then redeploy.

---

### Issue 2: "Invalid credentials" but password is correct

**Cause:** Environment variables not loaded

**Check:**

1. Verify env vars in Vercel dashboard
2. Redeploy after adding env vars
3. Check for typos in variable names

**Debug:**

```typescript
// Temporarily add to auth.ts (remove after debug)
console.log("Expected email:", process.env.ADMIN_EMAIL);
console.log("Expected password:", process.env.ADMIN_PASSWORD);
```

---

### Issue 3: Session not persisting

**Cause:** `NEXTAUTH_SECRET` missing or changed

**Solution:**

1. Generate new secret: `openssl rand -base64 32`
2. Set in Vercel env vars
3. Redeploy
4. Clear browser cookies
5. Login again

---

### Issue 4: CORS error on auth endpoints

**Cause:** `trustHost` not enabled

**Solution:** Already fixed in `lib/auth.ts`:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...
  trustHost: true, // ✅ This fixes it
});
```

---

## 🔒 Advanced Security (Optional)

### 1. Add Rate Limiting

Prevent brute force attacks:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 attempts per minute
});
```

### 2. Add 2FA (Two-Factor Authentication)

Use packages like:

- `@auth/core` with TOTP
- `speakeasy` for OTP generation
- `qrcode` for QR code display

### 3. Add Audit Logging

Log all admin actions:

```typescript
// lib/audit-log.ts
export async function logAction(action: string, userId: string) {
  await prisma.auditLog.create({
    data: {
      action,
      userId,
      timestamp: new Date(),
      ip: req.headers["x-forwarded-for"],
    },
  });
}
```

### 4. Add IP Whitelist

Restrict access to specific IPs:

```typescript
// middleware.ts
const ALLOWED_IPS = process.env.ALLOWED_IPS?.split(",") || [];

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for");

  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(ip)) {
    return new Response("Forbidden", { status: 403 });
  }
}
```

---

## 📊 Monitoring

### 1. Track Failed Login Attempts

Add to `lib/auth.ts`:

```typescript
async authorize(credentials) {
  // ... existing code ...

  if (credentials.email !== ADMIN_EMAIL ||
      credentials.password !== ADMIN_PASSWORD) {
    // Log failed attempt
    console.warn('Failed login attempt:', {
      email: credentials.email,
      timestamp: new Date(),
    });
    return null;
  }

  // ... success code ...
}
```

### 2. Session Monitoring

Track active sessions:

```typescript
callbacks: {
  async session({ session, token }) {
    // Log active session
    console.log('Active session:', {
      user: session.user?.email,
      timestamp: new Date(),
    });
    return session;
  },
}
```

---

## 🔄 Updating Credentials

### Change Password

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Edit `ADMIN_PASSWORD`
4. Click **Save**
5. Redeploy (or wait for auto-deploy)
6. Old password stops working immediately after deploy

### Change Email

1. Update `ADMIN_EMAIL` in Vercel
2. Redeploy
3. Login with new email

### Rotate Secret

1. Generate new: `openssl rand -base64 32`
2. Update `NEXTAUTH_SECRET` in Vercel
3. Redeploy
4. All users will be logged out
5. Need to login again

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] Changed default `ADMIN_EMAIL`
- [ ] Changed default `ADMIN_PASSWORD` (strong password)
- [ ] Generated unique `NEXTAUTH_SECRET`
- [ ] Set correct `NEXTAUTH_URL` (production domain)
- [ ] Removed demo credentials from UI
- [ ] Tested login flow
- [ ] Tested logout flow
- [ ] Tested session persistence
- [ ] Verified callback URLs work
- [ ] Checked Vercel function logs

After deployment:

- [ ] Test login with new credentials
- [ ] Verify no localhost redirects
- [ ] Check session works across pages
- [ ] Test logout functionality
- [ ] Monitor for failed login attempts
- [ ] Document credentials securely (password manager)

---

## 🔗 Related Documentation

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 📞 Support

If auth issues persist:

1. Check Vercel function logs
2. Verify all env vars are set
3. Clear browser cookies
4. Try incognito mode
5. Check for typos in credentials

---

**Remember:** Never commit credentials to git! Always use environment variables. 🔐
