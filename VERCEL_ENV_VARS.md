# 🔐 Vercel Environment Variables - Quick Reference

## 📦 Admin Dashboard

```env
# API Backend
NEXT_PUBLIC_API_URL=https://mutualist-api.vercel.app/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth
NEXTAUTH_URL=https://mutualist-admin.vercel.app
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Admin Credentials (CHANGE THESE!)
ADMIN_EMAIL=your-email@company.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Your Name
```

---

## 🌐 Life (Public Frontend)

```env
# API Backend
NEXT_PUBLIC_API_URL=https://mutualist-api.vercel.app/api
```

---

## 🚂 API (Railway - Recommended)

```env
# Node Environment
NODE_ENV=production
PORT=3002
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://postgres.[ref]:[password]@[host]:6543/postgres

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# CORS
ALLOWED_ORIGINS=https://mutualist-life.vercel.app,https://mutualist-admin.vercel.app
```

---

## 🔧 How to Generate Secrets

### NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Strong Password

```bash
openssl rand -base64 16
```

---

## ⚠️ Important Notes

1. **Never commit** `.env` files to git
2. **Change default** credentials in production
3. **Use different** secrets for each environment
4. **Rotate secrets** regularly (every 3-6 months)
5. **Document** credentials in password manager

---

## 🔄 After Setting Env Vars

1. **Redeploy** project (or wait for auto-deploy)
2. **Clear** browser cache/cookies
3. **Test** login flow
4. **Verify** API connections work

---

## 📝 Checklist

- [ ] All env vars set in Vercel
- [ ] Secrets generated (not default values)
- [ ] Production URLs (not localhost)
- [ ] Credentials documented securely
- [ ] Tested after deployment
