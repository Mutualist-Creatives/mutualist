# ⚡ Quick Reference Guide

Fast reference for common commands and configurations.

## 🚀 Quick Commands

### Setup (First Time)

```bash
bun install
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env.local
cp apps/life/.env.example apps/life/.env.local
cd apps/api && bunx prisma generate && bunx prisma db push
```

### Development

```bash
bun run dev                    # All apps
cd apps/api && bun run dev     # API only
cd apps/admin && bun run dev   # Admin only
cd apps/life && bun run dev    # Life only
```

### Database

```bash
cd apps/api
bunx prisma generate           # Generate client
bunx prisma db push            # Push schema
bunx prisma migrate dev        # Create migration
bunx prisma studio             # Open GUI
bunx prisma migrate reset      # Reset DB (⚠️ deletes data)
```

### Build & Deploy

```bash
bun run build                  # Build all
cd apps/api && bun run build   # Build API
cd apps/admin && bun run build # Build Admin
cd apps/life && bun run build  # Build Life
```

## 🌐 URLs

| App   | Development               | Production       |
| ----- | ------------------------- | ---------------- |
| API   | http://localhost:3002/api | [Your API URL]   |
| Admin | http://localhost:3001     | [Your Admin URL] |
| Life  | http://localhost:3000     | [Your Life URL]  |

## 📁 Important Files

```
apps/api/.env                  # API environment variables
apps/admin/.env.local          # Admin environment variables
apps/life/.env.local           # Life environment variables
apps/api/prisma/schema.prisma  # Database schema
```

## 🔑 Environment Variables

### API

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your-secret"
PORT=3002
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_KEY="eyJ..."
```

### Admin

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret
```

### Life

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

## 🛠️ Troubleshooting

### Prisma Client Error

```bash
cd apps/api && bunx prisma generate
```

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID [PID] /F

# Mac/Linux
lsof -i :3002
kill -9 [PID]
```

### Connection Refused

1. Check API is running
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Test: http://localhost:3002/api/portfolios

### Clean Install

```bash
rm -rf node_modules bun.lockb
bun install
```

## 📚 Documentation Links

- [Developer Onboarding](./DEVELOPER_ONBOARDING.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [Database Setup](./DATABASE_SETUP.md)
- [API Integration V2](./apps/life/API_INTEGRATION_V2.md)

## 🔗 External Resources

- [Bun Docs](https://bun.sh/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Need more details? Check the full documentation!**
