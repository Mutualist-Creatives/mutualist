# 🚀 Vercel API Setup Guide

## ⚠️ Important Note

**NestJS API lebih baik di-deploy ke Railway/Render**, bukan Vercel karena:

- Vercel = Serverless (timeout 10s, cold start)
- Railway/Render = Long-running server (lebih cocok untuk NestJS)

Tapi jika tetap mau deploy ke Vercel, ikuti panduan ini.

---

## 📦 Vercel Configuration

### Root Directory

```
apps/api
```

### Build Command

```bash
cd ../.. && npm install && cd apps/api && npm run build
```

### Output Directory

```
dist
```

### Install Command

```bash
cd ../.. && npm install
```

### Framework Preset

```
Other
```

---

## 🔐 Environment Variables

Di Vercel Dashboard → Project Settings → Environment Variables, tambahkan:

```env
# Node Environment
NODE_ENV=production

# Database (Supabase)
DATABASE_URL=postgresql://postgres.[ref]:[password]@[host]:6543/postgres?pgbouncer=true

# Supabase Storage
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

# CORS (Optional - default allow all)
ALLOWED_ORIGINS=https://mutualist-life.vercel.app,https://mutualist-admin.vercel.app

# Server Config (Optional)
PORT=3000
HOST=0.0.0.0
```

---

## 🌐 CORS Configuration

CORS sudah di-enable dengan 3 layer:

### 1. Serverless Handler (`api/index.ts`)

```typescript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader(
  "Access-Control-Allow-Methods",
  "GET, POST, PUT, DELETE, PATCH, OPTIONS"
);
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
```

### 2. Vercel Config (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ]
}
```

### 3. NestJS App (`main.ts`)

```typescript
app.enableCors({
  origin: true,
  credentials: true,
});
```

---

## 🧪 Testing API

### Test Health Endpoint

```bash
curl https://mutualist-api.vercel.app/api
```

Expected response:

```
"Hello World!"
```

### Test Portfolios Endpoint

```bash
curl https://mutualist-api.vercel.app/api/portfolios
```

Expected response:

```json
[
  {
    "id": "uuid",
    "title": "Project Title",
    ...
  }
]
```

### Test CORS

```bash
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://mutualist-api.vercel.app/api/portfolios
```

Should return CORS headers in response.

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error:**

```
Access-Control-Allow-Origin header missing
```

**Solution:**

1. Check environment variables di Vercel
2. Redeploy setelah update `api/index.ts` dan `vercel.json`
3. Clear browser cache
4. Test dengan curl untuk verify CORS headers

---

### Issue 2: 500 Internal Server Error

**Error:**

```
Internal Server Error
```

**Check:**

1. Vercel Function Logs (Dashboard → Deployments → View Function Logs)
2. Database connection (check `DATABASE_URL`)
3. Supabase credentials (check `SUPABASE_URL` dan `SUPABASE_SERVICE_KEY`)

**Common causes:**

- Missing environment variables
- Database connection failed
- Prisma client not generated

---

### Issue 3: Timeout Error

**Error:**

```
Function execution timeout
```

**Cause:** Vercel serverless timeout = 10 seconds

**Solution:**

- Optimize database queries
- Add indexes to database
- Or migrate to Railway/Render (recommended)

---

### Issue 4: Cold Start Slow

**Issue:** First request after idle takes 5-10 seconds

**Cause:** Serverless cold start

**Solutions:**

1. Use Vercel Pro (faster cold starts)
2. Keep function warm with cron job
3. Or migrate to Railway/Render (no cold start)

---

## 📊 Vercel Limitations

| Feature              | Vercel Serverless      | Railway/Render |
| -------------------- | ---------------------- | -------------- |
| Timeout              | 10s (Hobby), 60s (Pro) | No limit       |
| Cold Start           | Yes (slow)             | No             |
| WebSocket            | Limited                | Full support   |
| Long Polling         | No                     | Yes            |
| File Upload          | 4.5MB limit            | No limit       |
| Database Connections | Limited pool           | Full pool      |

---

## 🚀 Recommended: Migrate to Railway

### Why Railway is Better:

1. ✅ **No timeout** - Long-running server
2. ✅ **No cold start** - Always warm
3. ✅ **Better for NestJS** - Designed for traditional servers
4. ✅ **Easier debugging** - Real-time logs
5. ✅ **Database connections** - Better connection pooling

### Railway Setup:

```bash
# Root Directory
apps/api

# Build Command
cd ../.. && npm install && cd apps/api && npm run build

# Start Command
node apps/api/dist/main.js

# Environment Variables
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
ALLOWED_ORIGINS=https://life.vercel.app,https://admin.vercel.app
```

---

## 📝 Deployment Checklist

Before deploying to Vercel:

- [ ] All environment variables set
- [ ] Database accessible from Vercel
- [ ] Supabase storage bucket created
- [ ] CORS headers configured
- [ ] `vercel.json` updated
- [ ] `api/index.ts` has CORS headers
- [ ] Test locally with production env

After deployment:

- [ ] Test health endpoint
- [ ] Test portfolios endpoint
- [ ] Test CORS from browser
- [ ] Test file upload
- [ ] Check function logs for errors
- [ ] Update frontend API URLs

---

## 🔗 Update Frontend URLs

After API deployed, update environment variables di Vercel:

**Life Project:**

```env
NEXT_PUBLIC_API_URL=https://mutualist-api.vercel.app/api
```

**Admin Project:**

```env
NEXT_PUBLIC_API_URL=https://mutualist-api.vercel.app/api
```

Then redeploy both frontend apps.

---

## 📞 Support

If CORS still not working:

1. Check Vercel function logs
2. Test with curl (bypass browser CORS)
3. Verify headers in response
4. Check browser console for exact error

If performance issues:

1. Consider Railway/Render
2. Optimize database queries
3. Add caching layer
4. Use Vercel Pro for better limits

---

**Recommendation:** Deploy API to Railway for better performance and reliability! 🚂
