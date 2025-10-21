# Quick Start Guide

## Prerequisites

- PostgreSQL installed and running
- Bun installed

## Setup Steps

### 1. Install Dependencies

```bash
cd apps/api
bun install
```

### 2. Setup Database

Update `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mutualist?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
```

### 3. Run Migrations

```bash
bunx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
bunx prisma generate
```

### 5. Seed Database (Optional)

```bash
bunx prisma db seed
```

### 6. Start Development Server

```bash
bun run start:dev
```

API will be running at: `http://localhost:3001/api`

## Test API

### Get all portfolios

```bash
curl http://localhost:3001/api/portfolio
```

### Get categories

```bash
curl http://localhost:3001/api/portfolio/categories
```

### Create portfolio (POST)

```bash
curl -X POST http://localhost:3001/api/portfolio \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "createdBy": "Studio Name",
    "year": "2024",
    "category": "Design",
    "description": "Project description",
    "images": ["/path/to/image.jpg"]
  }'
```

## Prisma Studio (Database GUI)

```bash
bunx prisma studio
```

Opens at: `http://localhost:5555`

## Next Steps

1. Setup authentication (JWT)
2. Add file upload endpoint
3. Connect apps/admin to this API
4. Connect apps/life to fetch from this API
