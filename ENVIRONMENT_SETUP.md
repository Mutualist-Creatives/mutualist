# 🔧 Environment Setup Guide

## Overview

Project ini memiliki 3 aplikasi yang membutuhkan environment variables:

1. **API** (`/apps/api`) - Backend NestJS
2. **Admin** (`/apps/admin`) - Admin dashboard Next.js
3. **Life** (`/apps/life`) - Public portfolio website Next.js

## 📁 File Structure

```
mutualist/
├── apps/
│   ├── api/
│   │   └── .env                    # Backend environment
│   ├── admin/
│   │   └── .env.local              # Admin app environment
│   └── life/
│       └── .env.local              # Life app environment
└── ENVIRONMENT_SETUP.md            # This file
```

## 🔑 Environment Variables

### 1. API Backend (`/apps/api/.env`)

```env
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.aqmiasmqtueuqvdsgiez:VYJwirNyX8s5IWTz@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.aqmiasmqtueuqvdsgiez:VYJwirNyX8s5IWTz@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

JWT_SECRET="mutualist-api"
PORT=3002

# Supabase Storage (for file upload feature)
SUPABASE_URL="https://aqmiasmqtueuqvdsgiez.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbWlhc21xdHVldXF2ZHNnaWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5MTc3MiwiZXhwIjoyMDc1NTY3NzcyfQ.F2bUev2eNbmKOaTg-GwKlnCBX_uIQr7JmhzfHgItHWE"
```

**Variables Explained:**

- `DATABASE_URL` - Supabase PostgreSQL connection (pooled)
- `DIRECT_URL` - Direct database connection for migrations
- `JWT_SECRET` - Secret key for JWT authentication
- `PORT` - API server port (default: 3002)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Service role key (full access for backend)

---

### 2. Admin App (`/apps/admin/.env.local`)

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3002/api

# Supabase Configuration (for direct upload from admin)
NEXT_PUBLIC_SUPABASE_URL=https://aqmiasmqtueuqvdsgiez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbWlhc21xdHVldXF2ZHNnaWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTE3NzIsImV4cCI6MjA3NTU2Nzc3Mn0.8xqYvH_L5vPZQqxKGJYqZ0Zr5Zr5Zr5Zr5Zr5Zr5Zr5

# Auth (optional - for future authentication)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=mutualist-admin-secret
```

**Variables Explained:**

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous key for client-side uploads
- `NEXTAUTH_URL` - NextAuth base URL (for future auth)
- `NEXTAUTH_SECRET` - NextAuth secret key (for future auth)

---

### 3. Life App (`/apps/life/.env.local`)

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

**Variables Explained:**

- `NEXT_PUBLIC_API_URL` - Backend API endpoint for fetching portfolios

---

## 🚀 Quick Setup

### First Time Setup

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd mutualist
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Create environment files**

   Copy the content above to create these files:
   - `apps/api/.env`
   - `apps/admin/.env.local`
   - `apps/life/.env.local`

4. **Run database migrations** (API only)

   ```bash
   cd apps/api
   bunx prisma migrate dev
   bunx prisma generate
   ```

5. **Start all apps**

   ```bash
   # From root directory
   bun run dev

   # Or individually:
   cd apps/api && bun run dev      # Port 3002
   cd apps/admin && bun run dev    # Port 3001
   cd apps/life && bun run dev     # Port 3000
   ```

---

## 🔐 Security Notes

### ⚠️ Important

1. **Never commit `.env` files to git**
   - Already in `.gitignore`
   - Contains sensitive credentials

2. **Use different keys for production**
   - Generate new JWT secrets
   - Use production Supabase keys
   - Update database URLs

3. **Environment-specific configs**
   - Development: `localhost` URLs
   - Production: Real domain URLs

### 🔑 Key Types

| Key Type               | Usage                        | Where                   |
| ---------------------- | ---------------------------- | ----------------------- |
| `SUPABASE_SERVICE_KEY` | Backend only (full access)   | API `.env`              |
| `SUPABASE_ANON_KEY`    | Client-side (limited access) | Admin/Life `.env.local` |
| `JWT_SECRET`           | Backend authentication       | API `.env`              |
| `NEXTAUTH_SECRET`      | NextAuth sessions            | Admin `.env.local`      |

---

## 🌍 Production Setup

### Environment Variables for Production

#### API (Backend)

```env
DATABASE_URL="<production-database-url>"
DIRECT_URL="<production-direct-url>"
JWT_SECRET="<strong-random-secret>"
PORT=3002
SUPABASE_URL="<production-supabase-url>"
SUPABASE_SERVICE_KEY="<production-service-key>"
```

#### Admin App

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SUPABASE_URL=<production-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
NEXTAUTH_URL=https://admin.yourdomain.com
NEXTAUTH_SECRET=<strong-random-secret>
```

#### Life App

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

---

## 🧪 Testing Environment Variables

### Check if variables are loaded

**API:**

```bash
cd apps/api
bun run dev
# Should see: "🚀 API running on http://localhost:3002/api"
```

**Admin:**

```bash
cd apps/admin
bun run dev
# Open http://localhost:3001
# Check browser console for API URL
```

**Life:**

```bash
cd apps/life
bun run dev
# Open http://localhost:3000
# Should fetch portfolios from API
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:** Check `DATABASE_URL` is correct and database is accessible

### Issue: "SUPABASE_URL not defined"

**Solution:** Make sure `.env` file exists and contains `SUPABASE_URL`

### Issue: "Failed to fetch portfolios"

**Solution:**

1. Check API is running on port 3002
2. Check `NEXT_PUBLIC_API_URL` in Life/Admin `.env.local`
3. Check CORS settings in API

### Issue: "Upload failed"

**Solution:**

1. Check `SUPABASE_SERVICE_KEY` in API `.env`
2. Check Supabase storage bucket exists
3. Check bucket permissions

---

## 📋 Checklist

After setup, verify:

- [ ] All 3 `.env` files created
- [ ] API starts without errors
- [ ] Admin can connect to API
- [ ] Life can fetch portfolios
- [ ] File upload works in Admin
- [ ] Images display in Life app

---

## 🔗 Related Documentation

- [API Setup](./apps/api/README.md)
- [Admin Setup](./apps/admin/ADMIN_SETUP.md)
- [Life API Integration](./apps/life/API_INTEGRATION_V2.md)
- [Upload Flow](./apps/api/INSTALL_UPLOAD_DEPENDENCIES.md)

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Verify all environment variables are set
3. Check application logs for errors
4. Ensure all services are running

---

**Last Updated:** October 15, 2025  
**Version:** 1.0.0
