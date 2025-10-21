# 🚀 Quick Deploy Commands Reference

## 📦 Vercel - Life (Public Frontend)

```bash
# Project Settings
Project Name: mutualist-life
Framework: Next.js
Root Directory: apps/life

# Build Command
cd ../.. && turbo run build --filter=life

# Output Directory
.next

# Install Command
cd ../.. && bun install

# Environment Variables
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
```

---

## 🔐 Vercel - Admin (Dashboard)

```bash
# Project Settings
Project Name: mutualist-admin
Framework: Next.js
Root Directory: apps/admin

# Build Command
cd ../.. && turbo run build --filter=admin

# Output Directory
.next

# Install Command
cd ../.. && bun install

# Environment Variables
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
NEXTAUTH_URL=https://mutualist-admin.vercel.app
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
```

**Generate NextAuth Secret:**

```bash
openssl rand -base64 32
```

---

## 🚂 Railway - API (Backend)

```bash
# Service Settings
Root Directory: apps/api

# Build Command
cd ../.. && bun install && cd apps/api && bun run build

# Start Command
node apps/api/dist/main.js

# Watch Paths
apps/api/**

# Environment Variables
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
DATABASE_URL=postgresql://postgres.[ref]:[password]@[host]:6543/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
ALLOWED_ORIGINS=https://mutualist-life.vercel.app,https://mutualist-admin.vercel.app
```

**Run Migration (after first deploy):**

```bash
# In Railway CLI or add as Deploy Command
cd apps/api && npx prisma migrate deploy
```

---

## 🔄 Alternative: If Bun Not Available

Use npm/pnpm instead:

```bash
# Install Command (Vercel)
cd ../.. && npm install

# Build Command (Railway)
cd ../.. && npm install && cd apps/api && npm run build
```

---

## ✅ Verification Commands

```bash
# Test API Health
curl https://your-railway-app.railway.app/api/health

# Test API Portfolios
curl https://your-railway-app.railway.app/api/portfolios

# Check Prisma Client
curl https://your-railway-app.railway.app/api/portfolios/categories
```

---

## 🐛 Debug Commands

```bash
# Local build test
turbo run build --filter=life
turbo run build --filter=admin
turbo run build --filter=api

# Check Prisma
cd apps/api
npx prisma generate
npx prisma migrate status

# Test API locally
cd apps/api
bun run start:prod
```

---

## 📝 Deployment Checklist

### Before Deploy:

- [ ] Database created in Supabase
- [ ] Storage bucket created (`portfolio-images`)
- [ ] All environment variables ready
- [ ] Local build successful

### Deploy Order:

1. [ ] Deploy API to Railway
2. [ ] Run database migration
3. [ ] Deploy Life to Vercel
4. [ ] Deploy Admin to Vercel
5. [ ] Update CORS in Railway
6. [ ] Test all endpoints

### After Deploy:

- [ ] Test API health endpoint
- [ ] Test Life frontend
- [ ] Test Admin login
- [ ] Upload test image
- [ ] Create test portfolio
- [ ] Verify CORS working

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Turbo Docs**: https://turbo.build/repo/docs

---

## 💡 Pro Tips

1. **Use Railway CLI for debugging:**

   ```bash
   npm i -g @railway/cli
   railway login
   railway link
   railway logs
   ```

2. **Preview deployments on Vercel:**
   - Every PR gets a preview URL automatically
   - Test before merging to main

3. **Monitor Railway metrics:**
   - Check CPU/Memory usage
   - Set up alerts for high usage

4. **Vercel environment variables:**
   - Use different values for Preview vs Production
   - Preview: test API
   - Production: production API

---

## 🆘 Common Errors & Solutions

### Error: "Prisma Client not generated"

```bash
# Solution: Add to package.json
"prebuild": "prisma generate"
```

### Error: "Cannot find module"

```bash
# Solution: Check install command includes root
cd ../.. && bun install
```

### Error: "CORS blocked"

```bash
# Solution: Update ALLOWED_ORIGINS in Railway
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### Error: "Database connection failed"

```bash
# Solution: Check DATABASE_URL format
postgresql://user:pass@host:port/db?pgbouncer=true
```

---

## 📞 Need Help?

1. Check Railway/Vercel logs
2. Verify environment variables
3. Test API endpoints with curl
4. Check database connection in Supabase

Happy deploying! 🎉
