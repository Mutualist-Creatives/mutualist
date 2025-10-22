# 🔐 Vercel Admin Environment Variables Setup

## ⚠️ PENTING: Set Environment Variables di Vercel

Jika akses `https://mutualist-admin.vercel.app` redirect ke `localhost:3001`, berarti **environment variables belum di-set di Vercel**.

---

## 🚀 Step-by-Step Setup

### 1. Buka Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Pilih project **mutualist-admin**
3. Click **Settings** (tab di atas)

### 2. Go to Environment Variables

1. Di sidebar kiri, click **Environment Variables**
2. Atau langsung ke: `https://vercel.com/[your-username]/mutualist-admin/settings/environment-variables`

### 3. Add Environment Variables

Click **Add New** untuk setiap variable berikut:

---

#### Variable 1: NEXT_PUBLIC_API_URL

```
Name: NEXT_PUBLIC_API_URL
Value: https://mutualist-api.vercel.app/api
Environment: Production, Preview, Development (check all)
```

Click **Save**

---

#### Variable 2: NEXT_PUBLIC_SUPABASE_URL

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://aqmiasmqtueuqvdsgiez.supabase.co
Environment: Production, Preview, Development (check all)
```

Click **Save**

---

#### Variable 3: NEXT_PUBLIC_SUPABASE_ANON_KEY

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbWlhc21xdHVldXF2ZHNnaWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTE3NzIsImV4cCI6MjA3NTU2Nzc3Mn0.8xqYvH_L5vPZQqxKGJYqZ0Zr5Zr5Zr5Zr5Zr5Zr5Zr5
Environment: Production, Preview, Development (check all)
```

Click **Save**

---

#### Variable 4: NEXTAUTH_URL ⚠️ PENTING!

```
Name: NEXTAUTH_URL
Value: https://mutualist-admin.vercel.app
Environment: Production, Preview (check both, NOT Development)
```

**IMPORTANT:**

- Gunakan domain Vercel yang sebenarnya
- Jangan tambahkan trailing slash
- Hanya untuk Production & Preview, BUKAN Development

Click **Save**

---

#### Variable 5: NEXTAUTH_SECRET

Generate secret dulu:

```bash
openssl rand -base64 32
```

Copy output, lalu:

```
Name: NEXTAUTH_SECRET
Value: <paste-generated-secret-here>
Environment: Production, Preview, Development (check all)
```

Click **Save**

---

#### Variable 6: ADMIN_EMAIL

```
Name: ADMIN_EMAIL
Value: admin@mutualist.co
Environment: Production, Preview, Development (check all)
```

**IMPORTANT:** Ganti dengan email yang aman untuk production!

Click **Save**

---

#### Variable 7: ADMIN_PASSWORD

```
Name: ADMIN_PASSWORD
Value: YourSecurePassword123!
Environment: Production, Preview, Development (check all)
```

**IMPORTANT:**

- JANGAN gunakan `admin123` di production!
- Gunakan password yang kuat
- Minimal 12 karakter, mix uppercase, lowercase, numbers, symbols

Click **Save**

---

#### Variable 8: ADMIN_NAME

```
Name: ADMIN_NAME
Value: Mutualist Admin
Environment: Production, Preview, Development (check all)
```

Click **Save**

---

## 🔄 Redeploy

Setelah semua environment variables di-set:

### Option 1: Auto Redeploy (Recommended)

1. Go to **Deployments** tab
2. Click **...** (three dots) pada deployment terakhir
3. Click **Redeploy**
4. Confirm

### Option 2: Git Push

```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

---

## ✅ Verification

Setelah redeploy selesai:

### 1. Test Login Page

```
https://mutualist-admin.vercel.app/login
```

**Expected:**

- ✅ Shows login form
- ✅ No redirect to localhost
- ✅ URL stays at `https://mutualist-admin.vercel.app/login`

### 2. Test Login

1. Enter credentials (from `ADMIN_EMAIL` and `ADMIN_PASSWORD`)
2. Click **Sign In**

**Expected:**

- ✅ Redirect to `https://mutualist-admin.vercel.app/` (NOT localhost!)
- ✅ Shows dashboard
- ✅ Session persists on refresh

### 3. Test Protected Routes

```
https://mutualist-admin.vercel.app/portfolios
```

**Expected:**

- ✅ If not logged in → redirect to `/login`
- ✅ If logged in → shows portfolios page

---

## 🐛 Troubleshooting

### Still redirects to localhost:3001

**Possible causes:**

1. **Environment variables not saved**
   - Check: Go back to Environment Variables page
   - Verify all 8 variables are listed
   - Check they're enabled for Production

2. **Not redeployed after adding env vars**
   - Solution: Redeploy (see step above)

3. **Browser cache**
   - Solution: Clear browser cache or use Incognito mode

4. **Wrong NEXTAUTH_URL**
   - Check: Should be `https://mutualist-admin.vercel.app`
   - No trailing slash
   - No http (must be https)

---

### Login fails with "Invalid credentials"

**Check:**

1. Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Vercel
2. Make sure no extra spaces in values
3. Try resetting password in Vercel env vars
4. Redeploy after changes

---

### Session not persisting

**Check:**

1. `NEXTAUTH_SECRET` is set
2. `NEXTAUTH_SECRET` is at least 32 characters
3. Clear browser cookies
4. Try incognito mode

---

## 📊 Environment Variables Summary

| Variable                      | Value                                | Environment    |
| ----------------------------- | ------------------------------------ | -------------- |
| NEXT_PUBLIC_API_URL           | https://mutualist-api.vercel.app/api | All            |
| NEXT_PUBLIC_SUPABASE_URL      | https://[project].supabase.co        | All            |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJ...                               | All            |
| NEXTAUTH_URL                  | https://mutualist-admin.vercel.app   | Prod + Preview |
| NEXTAUTH_SECRET               | <generated>                          | All            |
| ADMIN_EMAIL                   | your-email@company.com               | All            |
| ADMIN_PASSWORD                | YourSecurePassword123!               | All            |
| ADMIN_NAME                    | Your Name                            | All            |

**Total: 8 environment variables**

---

## 🔐 Security Checklist

Before going live:

- [ ] Changed `ADMIN_EMAIL` from default
- [ ] Changed `ADMIN_PASSWORD` to strong password (not admin123)
- [ ] Generated unique `NEXTAUTH_SECRET` (not default)
- [ ] `NEXTAUTH_URL` matches actual domain
- [ ] All env vars saved in Vercel
- [ ] Redeployed after setting env vars
- [ ] Tested login flow
- [ ] Verified no localhost redirects
- [ ] Documented credentials securely (password manager)

---

## 📸 Visual Guide

### Where to find Environment Variables:

```
Vercel Dashboard
  └─ Your Project (mutualist-admin)
      └─ Settings (top tab)
          └─ Environment Variables (left sidebar)
              └─ Add New (button)
```

### How to add:

```
┌─────────────────────────────────────┐
│ Add Environment Variable            │
├─────────────────────────────────────┤
│ Name:  NEXTAUTH_URL                 │
│ Value: https://mutualist-admin...   │
│                                     │
│ Environment:                        │
│ ☑ Production                        │
│ ☑ Preview                           │
│ ☐ Development                       │
│                                     │
│ [Cancel]  [Save]                    │
└─────────────────────────────────────┘
```

---

## 🔗 Quick Links

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Generate Secret](https://generate-secret.vercel.app/32)

---

## 📞 Need Help?

If still having issues:

1. **Check Vercel Function Logs:**
   - Deployments → Latest → View Function Logs
   - Look for NextAuth errors

2. **Check Browser Console:**
   - F12 → Console tab
   - Look for redirect errors

3. **Verify env vars:**
   - Settings → Environment Variables
   - Make sure all 8 are there

4. **Try fresh deploy:**
   - Delete all env vars
   - Add them again one by one
   - Redeploy

---

**Remember:** Environment variables are REQUIRED for production. Without them, NextAuth will use defaults (localhost:3001). 🔐
