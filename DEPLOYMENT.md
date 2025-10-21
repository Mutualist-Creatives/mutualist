# 🚀 Deployment Guide - Mutualist Monorepo

## 📋 Prerequisites

1. **Database Setup** (Supabase/PostgreSQL)
2. **Supabase Storage** untuk upload images
3. **Vercel Account** untuk frontend apps
4. **Railway/Render Account** untuk backend API

---

## 🗄️ Step 1: Setup Database (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database to be ready

### 1.2 Get Database URL

```
Settings → Database → Connection String → URI
```

Copy the connection string:

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### 1.3 Get Supabase Keys

```
Settings → API → Project API keys
```

Copy:

- `SUPABASE_URL`: https://[project-ref].supabase.co
- `SUPABASE_SERVICE_KEY`: service_role key (secret)

### 1.4 Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Create new bucket: `portfolio-images`
3. Set as **Public bucket**
4. Enable **File size limit**: 5MB

---

## 🔧 Step 2: Deploy API to Railway

### 2.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your repository

### 2.2 Configure Railway Service

**Service Settings:**

```bash
# Root Directory
apps/api

# Build Command
cd ../.. && bun install && cd apps/api && bun run build

# Start Command
node apps/api/dist/main.js

# Watch Paths (optional)
apps/api/**
```

### 2.3 Add Environment Variables

Go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=3002
HOST=0.0.0.0

# Database (from Supabase)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Supabase
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# CORS (will update after Vercel deployment)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 2.4 Run Database Migration

After first deployment, run migration:

1. Go to Railway dashboard
2. Click on your service
3. Go to **Settings** → **Deploy**
4. Add **Deploy Command**:

```bash
cd apps/api && npx prisma migrate deploy
```

Or run manually in Railway CLI:

```bash
railway run npx prisma migrate deploy
```

### 2.5 Get Railway URL

After deployment, copy your Railway URL:

```
https://your-app-name.railway.app
```

Your API will be available at:

```
https://your-app-name.railway.app/api
```

---

## 🌐 Step 3: Deploy Life (Public Frontend) to Vercel

### 3.1 Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository
4. Configure project:

**Project Settings:**

```bash
Project Name: mutualist-life
Framework Preset: Next.js
Root Directory: apps/life
```

**Build & Development Settings:**

```bash
Build Command:
cd ../.. && turbo run build --filter=life

Output Directory:
.next

Install Command:
cd ../.. && bun install
```

### 3.2 Add Environment Variables

Go to **Settings** → **Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://your-app-name.railway.app/api
```

### 3.3 Deploy

Click **Deploy** and wait for build to complete.

### 3.4 Get Vercel URL

Copy your deployment URL:

```
https://mutualist-life.vercel.app
```

---

## 🔐 Step 4: Deploy Admin (Dashboard) to Vercel

### 4.1 Create New Vercel Project

1. In Vercel dashboard, click **Add New** → **Project**
2. Import the **same repository**
3. Configure project:

**Project Settings:**

```bash
Project Name: mutualist-admin
Framework Preset: Next.js
Root Directory: apps/admin
```

**Build & Development Settings:**

```bash
Build Command:
cd ../.. && turbo run build --filter=admin

Output Directory:
.next

Install Command:
cd ../.. && bun install
```

### 4.2 Generate NextAuth Secret

Run in terminal:

```bash
openssl rand -base64 32
```

Copy the output.

### 4.3 Add Environment Variables

Go to **Settings** → **Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://your-app-name.railway.app/api
NEXTAUTH_URL=https://mutualist-admin.vercel.app
NEXTAUTH_SECRET=your-generated-secret-from-step-4.2
```

### 4.4 Deploy

Click **Deploy** and wait for build to complete.

### 4.5 Get Vercel URL

Copy your deployment URL:

```
https://mutualist-admin.vercel.app
```

---

## 🔄 Step 5: Update CORS Settings

### 5.1 Update Railway Environment Variables

Go back to Railway → Your API service → **Variables**

Update `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://mutualist-life.vercel.app,https://mutualist-admin.vercel.app
```

### 5.2 Redeploy API

Railway will automatically redeploy after env var change.

---

## ✅ Step 6: Verify Deployment

### 6.1 Test API

```bash
curl https://your-app-name.railway.app/api/health
```

Should return:

```json
{ "status": "ok" }
```

### 6.2 Test Life Frontend

Visit: `https://mutualist-life.vercel.app`

Should load the portfolio gallery.

### 6.3 Test Admin Dashboard

Visit: `https://mutualist-admin.vercel.app`

Should show login page.

**Default credentials:**

```
Email: admin@mutualist.co
Password: admin123
```

---

## 🐛 Troubleshooting

### API Returns 500 Error

**Check Railway Logs:**

1. Go to Railway dashboard
2. Click on your service
3. Go to **Deployments** → Latest deployment → **View Logs**

**Common Issues:**

1. **Prisma Client Not Generated**

   ```
   Error: @prisma/client did not initialize yet
   ```

   **Solution:** Make sure `prebuild` script runs:

   ```json
   "prebuild": "prisma generate"
   ```

2. **Database Connection Failed**

   ```
   Error: Can't reach database server
   ```

   **Solution:** Check `DATABASE_URL` in Railway env vars.

3. **Missing Environment Variables**

   ```
   Error: SUPABASE_URL must be defined
   ```

   **Solution:** Add all required env vars in Railway.

### Vercel Build Failed

**Check Build Logs:**

1. Go to Vercel dashboard
2. Click on your project
3. Go to **Deployments** → Failed deployment → **View Function Logs**

**Common Issues:**

1. **Turbo not found**

   ```
   Error: turbo: command not found
   ```

   **Solution:** Make sure install command includes root:

   ```bash
   cd ../.. && bun install
   ```

2. **Module not found**

   ```
   Error: Cannot find module '@/components/...'
   ```

   **Solution:** Check `tsconfig.json` paths are correct.

### CORS Error in Browser

**Error:**

```
Access to fetch at 'https://api.../api/portfolios' from origin 'https://life...' has been blocked by CORS
```

**Solution:** Update `ALLOWED_ORIGINS` in Railway to include your Vercel URLs.

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Both Vercel and Railway will automatically deploy when you push to your main branch.

**To disable auto-deploy:**

**Vercel:**

1. Go to Project Settings → Git
2. Uncheck "Production Branch"

**Railway:**

1. Go to Service Settings → Deploy
2. Disable "Auto Deploy"

---

## 📊 Monitoring

### Railway Metrics

- Go to your service → **Metrics**
- Monitor CPU, Memory, Network usage

### Vercel Analytics

- Go to your project → **Analytics**
- Monitor page views, performance

---

## 🔐 Security Checklist

- [ ] Change default admin password in production
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable Supabase RLS (Row Level Security)
- [ ] Set proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only (automatic on Vercel/Railway)
- [ ] Set up database backups in Supabase

---

## 📝 Environment Variables Summary

### API (Railway)

```env
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
ALLOWED_ORIGINS=https://life...,https://admin...
```

### Life (Vercel)

```env
NEXT_PUBLIC_API_URL=https://api.../api
```

### Admin (Vercel)

```env
NEXT_PUBLIC_API_URL=https://api.../api
NEXTAUTH_URL=https://admin...
NEXTAUTH_SECRET=...
```

---

## 🎉 Done!

Your Mutualist monorepo is now deployed!

- **Life**: https://mutualist-life.vercel.app
- **Admin**: https://mutualist-admin.vercel.app
- **API**: https://your-app-name.railway.app/api

---

## 📞 Support

If you encounter issues:

1. Check Railway/Vercel logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check database connection

Happy deploying! 🚀
