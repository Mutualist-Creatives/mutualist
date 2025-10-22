# 🔧 Fix: NextAuth Redirect ke Port yang Salah

## ❌ Masalah

Saat akses admin di port berbeda (misal port 3000), NextAuth selalu redirect ke `http://localhost:3001/login`

## ✅ Solusi

### Development (Lokal)

**Hapus atau comment `NEXTAUTH_URL` di `.env.local`:**

```env
# ❌ JANGAN INI (hardcoded port)
NEXTAUTH_URL=http://localhost:3001

# ✅ GUNAKAN INI (auto-detect)
# NEXTAUTH_URL is auto-detected in development
# Leave this commented out or remove it
```

**Kenapa?**

- NextAuth dengan `trustHost: true` akan auto-detect URL dari request
- Jadi bisa jalan di port berapa pun (3000, 3001, 4000, dll)
- Tidak perlu hardcode port

---

### Production (Vercel)

**SET `NEXTAUTH_URL` di Vercel Environment Variables:**

```env
NEXTAUTH_URL=https://mutualist-admin.vercel.app
```

**Kenapa?**

- Production harus explicit untuk security
- Prevent host header injection attacks
- Ensure consistent callback URLs

---

## 🔄 Cara Update

### 1. Update `.env.local`

```bash
# Edit apps/admin/.env.local
# Comment atau hapus baris NEXTAUTH_URL
```

**Before:**

```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=mutualist-admin-secret
```

**After:**

```env
# NEXTAUTH_URL auto-detected in development
NEXTAUTH_SECRET=mutualist-admin-secret
```

### 2. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Start again
bun run dev
```

### 3. Test

- Akses di port berapa pun: `http://localhost:3000`, `http://localhost:4000`, dll
- Login harus redirect ke port yang sama
- Tidak ada redirect ke port 3001

---

## 📝 Penjelasan Teknis

### trustHost: true

Di `apps/admin/lib/auth.ts`:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...
  trustHost: true, // ← Ini yang memungkinkan auto-detect
});
```

**Apa yang dilakukan:**

1. NextAuth membaca `Host` header dari request
2. Menggunakan host tersebut untuk generate callback URLs
3. Tidak perlu hardcode `NEXTAUTH_URL` di development

**Kapan aman:**

- ✅ Development (localhost)
- ✅ Production dengan proper reverse proxy (Vercel, Netlify)
- ❌ Production tanpa reverse proxy (set `NEXTAUTH_URL` explicit)

---

## 🌐 Environment Variables Summary

### Development (.env.local)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3002/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth
# NEXTAUTH_URL - Leave commented (auto-detected)
NEXTAUTH_SECRET=mutualist-admin-secret

# Admin Credentials
ADMIN_EMAIL=admin@mutualist.co
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin
```

### Production (Vercel)

```env
# API
NEXT_PUBLIC_API_URL=https://mutualist-api.vercel.app/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth (REQUIRED in production)
NEXTAUTH_URL=https://mutualist-admin.vercel.app
NEXTAUTH_SECRET=your-generated-secret

# Admin Credentials
ADMIN_EMAIL=your-email@company.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Your Name
```

---

## ✅ Verification

Setelah fix, test:

1. **Port 3000:**

   ```bash
   PORT=3000 bun run dev
   ```

   Login → Should redirect to `http://localhost:3000/`

2. **Port 4000:**

   ```bash
   PORT=4000 bun run dev
   ```

   Login → Should redirect to `http://localhost:4000/`

3. **Default port (3001):**
   ```bash
   bun run dev
   ```
   Login → Should redirect to `http://localhost:3001/`

Semua harus redirect ke port yang sama dengan yang diakses! ✅

---

## 🐛 Troubleshooting

### Masih redirect ke port 3001

**Cek:**

1. Sudah comment/hapus `NEXTAUTH_URL` di `.env.local`?
2. Sudah restart dev server?
3. Clear browser cookies
4. Try incognito mode

**Debug:**

```typescript
// Temporary add to lib/auth.ts
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("trustHost:", true);
```

### Production redirect ke localhost

**Cause:** `NEXTAUTH_URL` tidak di-set di Vercel

**Solution:**

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add `NEXTAUTH_URL=https://your-domain.vercel.app`
4. Redeploy

---

## 📚 References

- [NextAuth.js - trustHost](https://next-auth.js.org/configuration/options#trusthost)
- [NextAuth.js - NEXTAUTH_URL](https://next-auth.js.org/configuration/options#nextauth_url)

---

**TL;DR:** Hapus `NEXTAUTH_URL` dari `.env.local` untuk development, set di Vercel untuk production. 🎯
