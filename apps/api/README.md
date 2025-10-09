# Mutualist API

NestJS API for Mutualist Portfolio Management

## Setup

1. Install dependencies:

```bash
bun install
```

2. Setup database (PostgreSQL):

```bash
# Update DATABASE_URL in .env file
# Then run migrations
bunx prisma migrate dev --name init
```

3. Generate Prisma Client:

```bash
bunx prisma generate
```

4. Seed database (optional):

```bash
bunx prisma db seed
```

## Development

```bash
bun run start:dev
```

API will be available at `http://localhost:3001/api`

## API Endpoints

### Portfolio

- `GET /api/portfolio` - Get all portfolios
- `GET /api/portfolio/:id` - Get portfolio by ID
- `GET /api/portfolio/categories` - Get all categories
- `POST /api/portfolio` - Create portfolio (protected)
- `PATCH /api/portfolio/:id` - Update portfolio (protected)
- `DELETE /api/portfolio/:id` - Delete portfolio (protected)

### Health Check

- `GET /api` - API health check

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mutualist"
JWT_SECRET="your-secret-key"
PORT=3001
```

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Class Validator
