# 🗄️ Database Setup Guide

Complete guide for setting up and managing the PostgreSQL database via Supabase.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Supabase Setup](#supabase-setup)
3. [Database Schema](#database-schema)
4. [Connection Configuration](#connection-configuration)
5. [Migrations](#migrations)
6. [Seeding Data](#seeding-data)
7. [Backup & Restore](#backup--restore)
8. [Common Operations](#common-operations)

---

## 🎯 Overview

### Technology Stack

- **Database:** PostgreSQL 15
- **Hosting:** Supabase (managed PostgreSQL)
- **ORM:** Prisma
- **Connection Pooling:** PgBouncer (via Supabase)

### Why Supabase?

- ✅ Free tier with generous limits
- ✅ Managed PostgreSQL (no server maintenance)
- ✅ Built-in connection pooling
- ✅ Integrated storage for images
- ✅ Real-time capabilities (future use)
- ✅ Automatic backups

---

## 🚀 Supabase Setup

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub/Google/Email

### Step 2: Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name:** mutualist-portfolio (or your choice)
   - **Database Password:** Generate strong password (save this!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free (sufficient for development)

3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

### Step 3: Get Database Credentials

#### Connection Strings

1. Go to **Project Settings** (gear icon)
2. Click **Database** in sidebar
3. Scroll to **Connection String** section
4. Copy both:
   - **Transaction Pooling** (for `DATABASE_URL`)
   - **Session Pooling** (for `DIRECT_URL`)

**Example:**

```
Transaction: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
Session: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

5. Replace `[YOUR-PASSWORD]` with your actual database password

#### API Keys

1. Go to **Project Settings** > **API**
2. Copy:
   - **Project URL** (for `SUPABASE_URL`)
   - **service_role key** (for `SUPABASE_SERVICE_KEY`)
   - **anon key** (for `SUPABASE_ANON_KEY`)

### Step 4: Configure Environment

Update `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📊 Database Schema

### Current Schema

```prisma
// apps/api/prisma/schema.prisma

model Portfolio {
  id          String   @id @default(cuid())
  title       String
  createdBy   String
  year        String
  category    String
  description String   @db.Text
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("portfolios")
}
```

### Schema Explanation

| Field         | Type          | Description              |
| ------------- | ------------- | ------------------------ |
| `id`          | String (CUID) | Unique identifier        |
| `title`       | String        | Portfolio title          |
| `createdBy`   | String        | Creator name             |
| `year`        | String        | Year created             |
| `category`    | String        | Portfolio category       |
| `description` | Text          | Detailed description     |
| `images`      | String[]      | Array of image URLs      |
| `createdAt`   | DateTime      | Auto-generated timestamp |
| `updatedAt`   | DateTime      | Auto-updated timestamp   |

### Indexes

Currently no custom indexes. Consider adding for performance:

```prisma
model Portfolio {
  // ... fields ...

  @@index([category])
  @@index([createdAt])
}
```

---

## 🔌 Connection Configuration

### Connection Types

#### 1. Transaction Pooling (Recommended for API)

```env
DATABASE_URL="postgresql://...@...pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Use for:**

- API requests (short-lived connections)
- High concurrency
- Serverless environments

**Limitations:**

- Cannot use transactions
- Cannot use prepared statements
- Cannot use some PostgreSQL features

#### 2. Direct Connection (For Migrations)

```env
DIRECT_URL="postgresql://...@...pooler.supabase.com:5432/postgres"
```

**Use for:**

- Database migrations
- Schema changes
- Admin operations
- Long-running queries

### Prisma Configuration

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## 🔄 Migrations

### Development Workflow

#### 1. Create Migration

```bash
cd apps/api
bunx prisma migrate dev --name add_new_field
```

This will:

- Create migration file in `prisma/migrations/`
- Apply migration to database
- Regenerate Prisma Client

#### 2. Apply Existing Migrations

```bash
bunx prisma migrate deploy
```

Use this when:

- Pulling latest code with new migrations
- Deploying to production

#### 3. Reset Database (⚠️ Destructive)

```bash
bunx prisma migrate reset
```

This will:

- Drop all tables
- Re-run all migrations
- Run seed script (if exists)

### Production Workflow

```bash
# 1. Generate Prisma Client
bunx prisma generate

# 2. Apply migrations
bunx prisma migrate deploy

# 3. Verify
bunx prisma migrate status
```

### Quick Schema Updates (Development Only)

```bash
# Push schema changes without creating migration
bunx prisma db push
```

**Use when:**

- Rapid prototyping
- Schema is not finalized
- Development environment only

**Don't use in production!**

---

## 🌱 Seeding Data

### Create Seed Script

Create `apps/api/prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.portfolio.deleteMany();

  // Create sample portfolios
  const portfolios = await prisma.portfolio.createMany({
    data: [
      {
        title: "Project Alpha",
        createdBy: "Creative Studio",
        year: "2023",
        category: "Branding",
        description: "A complete branding overhaul for a leading tech company.",
        images: ["/assets/portfolios/1.png"],
      },
      {
        title: "Project Bravo",
        createdBy: "Design Wizards",
        year: "2022",
        category: "Web Design",
        description: "Responsive and modern website design for a startup.",
        images: ["/assets/portfolios/2.png"],
      },
      // Add more...
    ],
  });

  console.log(`Created ${portfolios.count} portfolios`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Run Seed

```bash
cd apps/api
bunx prisma db seed
```

Or manually:

```bash
bunx tsx prisma/seed.ts
```

---

## 💾 Backup & Restore

### Automatic Backups (Supabase)

Supabase automatically backs up your database:

- **Free tier:** Daily backups, 7 days retention
- **Pro tier:** Daily backups, 30 days retention

Access backups:

1. Go to Supabase Dashboard
2. Database > Backups
3. Download or restore

### Manual Backup

```bash
# Export schema
bunx prisma db pull

# Export data (requires pg_dump)
pg_dump -h aws-0-region.pooler.supabase.com \
        -U postgres.xxxxx \
        -d postgres \
        -f backup.sql
```

### Restore from Backup

```bash
# Using psql
psql -h aws-0-region.pooler.supabase.com \
     -U postgres.xxxxx \
     -d postgres \
     -f backup.sql
```

---

## 🛠️ Common Operations

### View Database in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. View/edit data directly

### Query Database

```bash
# Open Prisma Studio (GUI)
cd apps/api
bunx prisma studio
```

Opens at http://localhost:5555

### Check Connection

```bash
cd apps/api
bunx prisma db pull
```

If successful, connection is working.

### View Schema

```bash
bunx prisma format
bunx prisma validate
```

### Generate Prisma Client

```bash
bunx prisma generate
```

Run after:

- Cloning repository
- Changing schema
- Switching branches

### Reset Auto-increment

```sql
-- If using serial/sequence (not CUID)
ALTER SEQUENCE portfolios_id_seq RESTART WITH 1;
```

---

## 🔍 Monitoring & Debugging

### Enable Query Logging

In `apps/api/src/prisma/prisma.service.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ["query", "info", "warn", "error"],
    });
  }
}
```

### Check Connection Pool

Supabase Dashboard > Database > Connection Pooling

Monitor:

- Active connections
- Idle connections
- Max connections

### Performance Tips

1. **Use indexes** for frequently queried fields
2. **Limit results** with `take` and `skip`
3. **Select specific fields** instead of all
4. **Use connection pooling** (already configured)
5. **Batch operations** when possible

---

## 🚨 Troubleshooting

### "Can't reach database server"

**Causes:**

- Wrong connection string
- Database not running
- Network issues
- IP not whitelisted (if configured)

**Solution:**

1. Check `DATABASE_URL` in `.env`
2. Verify Supabase project is active
3. Test connection: `bunx prisma db pull`

### "Prepared statement already exists"

**Cause:** Using transaction pooling with prepared statements

**Solution:** Use `DIRECT_URL` for migrations:

```bash
bunx prisma migrate dev
```

### "Too many connections"

**Cause:** Connection pool exhausted

**Solution:**

1. Use connection pooling (port 6543)
2. Close connections properly
3. Increase pool size in Supabase settings

### "Migration failed"

**Solution:**

```bash
# Check migration status
bunx prisma migrate status

# Resolve failed migration
bunx prisma migrate resolve --applied [migration_name]

# Or reset (⚠️ deletes data)
bunx prisma migrate reset
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Connection Pooling Guide](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
2. **Use strong database passwords**
3. **Rotate credentials regularly**
4. **Use service_role key only in backend**
5. **Enable Row Level Security (RLS)** for sensitive data
6. **Limit database user permissions**
7. **Monitor database logs** for suspicious activity

---

**Last Updated:** October 15, 2025  
**Version:** 1.0.0
