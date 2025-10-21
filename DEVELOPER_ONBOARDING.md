# 🚀 Developer Onboarding Guide

Welcome to the Mutualist Portfolio Project! This guide will help you get started quickly.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the Project](#running-the-project)
7. [Project Structure](#project-structure)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This is a monorepo project with 3 applications:

| App       | Description              | Port | Tech Stack                    |
| --------- | ------------------------ | ---- | ----------------------------- |
| **API**   | Backend REST API         | 3002 | NestJS + Prisma + PostgreSQL  |
| **Admin** | Admin dashboard          | 3001 | Next.js 15 + TypeScript       |
| **Life**  | Public portfolio website | 3000 | Next.js 15 + TypeScript + SWR |

### Architecture

```
┌─────────────┐
│   Life App  │ ──┐
│  (Public)   │   │
└─────────────┘   │
                  │    ┌──────────┐      ┌────────────┐
┌─────────────┐   ├───▶│   API    │─────▶│  Database  │
│  Admin App  │   │    │ (NestJS) │      │ PostgreSQL │
│  (Private)  │ ──┘    └──────────┘      └────────────┘
└─────────────┘              │
                             │
                             ▼
                      ┌─────────────┐
                      │  Supabase   │
                      │   Storage   │
                      └─────────────┘
```

---

## 🔧 Prerequisites

Before you begin, ensure you have:

- **Bun** v1.0+ ([Install Bun](https://bun.sh/docs/installation))
- **Node.js** v18+ (for compatibility)
- **Git**
- **Supabase Account** (free tier is fine)
- **Code Editor** (VS Code recommended)

### Check Your Setup

```bash
bun --version    # Should be 1.0+
node --version   # Should be 18+
git --version    # Any recent version
```

---

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd mutualist
```

### 2. Install Dependencies

```bash
bun install
```

This will install dependencies for all apps in the monorepo.

### 3. Setup Environment Variables

Copy example files and fill in your credentials:

```bash
# API
cp apps/api/.env.example apps/api/.env

# Admin
cp apps/admin/.env.example apps/admin/.env.local

# Life
cp apps/life/.env.example apps/life/.env.local
```

**Important:** Don't skip this step! See [Environment Configuration](#environment-configuration) for details.

### 4. Setup Database

```bash
cd apps/api
bunx prisma generate
bunx prisma db push
cd ../..
```

### 5. Start Development Servers

```bash
bun run dev
```

This will start all 3 apps simultaneously:

- API: http://localhost:3002/api
- Admin: http://localhost:3001
- Life: http://localhost:3000

---

## 🗄️ Database Setup

### Option 1: Use Existing Supabase Project (Recommended)

If you have access to the existing Supabase project:

1. Get credentials from team lead
2. Copy to `apps/api/.env`
3. Run `bunx prisma generate`
4. Done! ✅

### Option 2: Create New Supabase Project

1. **Create Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose organization and region
   - Set database password (save this!)

2. **Get Database URL**
   - Go to Project Settings > Database
   - Copy "Connection String" (Transaction Pooling)
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Get API Keys**
   - Go to Project Settings > API
   - Copy "Project URL"
   - Copy "service_role" key (for backend)
   - Copy "anon" key (for frontend)

4. **Create Storage Bucket**
   - Go to Storage
   - Create new bucket: `portfolio-images`
   - Set to Public
   - Enable RLS (Row Level Security) if needed

5. **Update Environment Files**
   - Add credentials to `apps/api/.env`
   - Add credentials to `apps/admin/.env.local`

6. **Push Database Schema**
   ```bash
   cd apps/api
   bunx prisma db push
   ```

---

## 🔐 Environment Configuration

### API (`apps/api/.env`)

```env
# Database URLs from Supabase
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-strong-random-secret"

# Server Port
PORT=3002

# Supabase Storage
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Where to get:**

- `DATABASE_URL` & `DIRECT_URL`: Supabase > Settings > Database > Connection String
- `SUPABASE_URL`: Supabase > Settings > API > Project URL
- `SUPABASE_SERVICE_KEY`: Supabase > Settings > API > service_role key

### Admin (`apps/admin/.env.local`)

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3002/api

# Supabase (for direct uploads)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# NextAuth (for future auth)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET="your-strong-random-secret"
```

**Where to get:**

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase > Settings > API > anon key

### Life (`apps/life/.env.local`)

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

---

## 🏃 Running the Project

### All Apps Together

```bash
# From root directory
bun run dev
```

### Individual Apps

```bash
# API only
cd apps/api
bun run dev

# Admin only
cd apps/admin
bun run dev

# Life only
cd apps/life
bun run dev
```

### Production Build

```bash
# Build all apps
bun run build

# Or individually
cd apps/api && bun run build
cd apps/admin && bun run build
cd apps/life && bun run build
```

---

## 📁 Project Structure

```
mutualist/
├── apps/
│   ├── api/                    # Backend API (NestJS)
│   │   ├── src/
│   │   │   ├── portfolio/      # Portfolio module
│   │   │   ├── upload/         # File upload module
│   │   │   ├── prisma/         # Prisma service
│   │   │   └── main.ts         # Entry point
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   ├── .env                # API environment variables
│   │   └── package.json
│   │
│   ├── admin/                  # Admin Dashboard (Next.js)
│   │   ├── app/                # App router
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities & API client
│   │   ├── .env.local          # Admin environment variables
│   │   └── package.json
│   │
│   └── life/                   # Public Website (Next.js)
│       ├── app/                # App router
│       ├── components/         # React components
│       ├── lib/                # Utilities & hooks
│       ├── data/               # Static data & types
│       ├── .env.local          # Life environment variables
│       └── package.json
│
├── node_modules/               # Shared dependencies
├── package.json                # Root package.json
├── bun.lockb                   # Bun lock file
├── DEVELOPER_ONBOARDING.md     # This file
├── ENVIRONMENT_SETUP.md        # Detailed env setup
└── README.md                   # Project README
```

---

## 🛠️ Common Tasks

### Add New Portfolio (via Admin)

1. Open http://localhost:3001
2. Login (default: admin/admin)
3. Click "Create Portfolio"
4. Fill form and upload images
5. Submit

### View Portfolios (via Life)

1. Open http://localhost:3000
2. Drag to navigate infinite canvas
3. Click card to view details

### Database Migrations

```bash
cd apps/api

# Create migration
bunx prisma migrate dev --name migration_name

# Apply migrations
bunx prisma migrate deploy

# Reset database (⚠️ deletes all data)
bunx prisma migrate reset
```

### Update Database Schema

1. Edit `apps/api/prisma/schema.prisma`
2. Run `bunx prisma db push` (for dev)
3. Or create migration: `bunx prisma migrate dev`

### Add New API Endpoint

1. Create/edit controller in `apps/api/src/[module]/`
2. Add service method
3. Update DTO if needed
4. Test with Postman/Thunder Client

### Add New Component

```bash
# In admin or life app
cd apps/admin  # or apps/life
touch components/my-component.tsx
```

---

## 🐛 Troubleshooting

### Issue: "Prisma Client not initialized"

**Solution:**

```bash
cd apps/api
bunx prisma generate
```

### Issue: "Cannot connect to database"

**Solution:**

1. Check `DATABASE_URL` in `apps/api/.env`
2. Verify Supabase project is active
3. Check database password is correct
4. Test connection: `bunx prisma db pull`

### Issue: "Port already in use"

**Solution:**

```bash
# Find process using port
netstat -ano | findstr :3002  # Windows
lsof -i :3002                 # Mac/Linux

# Kill process
taskkill /PID [PID] /F        # Windows
kill -9 [PID]                 # Mac/Linux
```

### Issue: "ECONNREFUSED" in Admin/Life

**Solution:**

1. Make sure API is running on port 3002
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify API responds: http://localhost:3002/api/portfolios

### Issue: "Upload failed"

**Solution:**

1. Check `SUPABASE_SERVICE_KEY` in `apps/api/.env`
2. Verify storage bucket exists in Supabase
3. Check bucket is public
4. Verify bucket name matches in code

### Issue: "Module not found"

**Solution:**

```bash
# Clean install
rm -rf node_modules
rm bun.lockb
bun install
```

### Issue: "Build failed"

**Solution:**

```bash
# Check TypeScript errors
cd apps/[app-name]
bun run type-check  # or tsc --noEmit

# Check linting
bun run lint
```

---

## 📚 Additional Resources

### Documentation

- [Environment Setup Guide](./ENVIRONMENT_SETUP.md) - Detailed environment configuration
- [API Integration V2](./apps/life/API_INTEGRATION_V2.md) - SWR implementation details
- [Admin Setup](./apps/admin/ADMIN_SETUP.md) - Admin app features
- [Upload Flow](./apps/api/INSTALL_UPLOAD_DEPENDENCIES.md) - File upload implementation

### External Docs

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [SWR Documentation](https://swr.vercel.app/)
- [Bun Documentation](https://bun.sh/docs)

### API Endpoints

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | `/api/portfolios`            | Get all portfolios     |
| GET    | `/api/portfolios/:id`        | Get portfolio by ID    |
| POST   | `/api/portfolios`            | Create portfolio       |
| PUT    | `/api/portfolios/:id`        | Update portfolio       |
| DELETE | `/api/portfolios/:id`        | Delete portfolio       |
| GET    | `/api/portfolios/categories` | Get unique categories  |
| POST   | `/api/upload`                | Upload file to storage |

---

## 🤝 Getting Help

### Before Asking

1. Check this documentation
2. Search existing issues
3. Check console/terminal for errors
4. Try troubleshooting steps above

### When Asking for Help

Include:

- What you're trying to do
- What you expected to happen
- What actually happened
- Error messages (full stack trace)
- Your environment (OS, Bun version, etc.)
- Steps to reproduce

### Contact

- **Team Lead:** [Name/Email]
- **Project Manager:** [Name/Email]
- **Slack Channel:** #mutualist-dev

---

## ✅ Onboarding Checklist

Use this checklist to ensure you're fully set up:

- [ ] Bun installed and working
- [ ] Repository cloned
- [ ] Dependencies installed (`bun install`)
- [ ] Environment files created and configured
  - [ ] `apps/api/.env`
  - [ ] `apps/admin/.env.local`
  - [ ] `apps/life/.env.local`
- [ ] Database connected
- [ ] Prisma client generated
- [ ] Database schema pushed
- [ ] All 3 apps running successfully
- [ ] Can access API at http://localhost:3002/api
- [ ] Can access Admin at http://localhost:3001
- [ ] Can access Life at http://localhost:3000
- [ ] Can create portfolio via Admin
- [ ] Can view portfolio in Life
- [ ] Read all documentation
- [ ] Joined team communication channels

---

## 🎉 You're Ready!

Congratulations! You're now set up and ready to contribute to the Mutualist Portfolio Project.

**Next Steps:**

1. Explore the codebase
2. Try creating a portfolio
3. Check out open issues/tasks
4. Ask questions if you're stuck

Happy coding! 🚀

---

**Last Updated:** October 15, 2025  
**Version:** 1.0.0  
**Maintained by:** Mutualist Team
