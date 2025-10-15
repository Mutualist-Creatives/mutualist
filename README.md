# 🎨 Mutualist Portfolio Project

A modern, full-stack portfolio management system with an infinite canvas interface.

## 🚀 Quick Start

```bash
# Clone repository
git clone <repository-url>
cd mutualist

# Install dependencies
bun install

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env.local
cp apps/life/.env.example apps/life/.env.local
# Edit the files and add your credentials

# Setup database
cd apps/api
bunx prisma generate
bunx prisma db push
cd ../..

# Start all apps
bun run dev
```

Visit:

- **API:** http://localhost:3002/api
- **Admin:** http://localhost:3001
- **Life:** http://localhost:3000

## 📚 Documentation

### Getting Started

- **[Developer Onboarding](./DEVELOPER_ONBOARDING.md)** - Complete setup guide for new developers
- **[Environment Setup](./ENVIRONMENT_SETUP.md)** - Detailed environment configuration
- **[Database Setup](./DATABASE_SETUP.md)** - Database connection and management

### App-Specific Docs

- **[API Documentation](./apps/api/README.md)** - Backend API details
- **[Admin Setup](./apps/admin/ADMIN_SETUP.md)** - Admin dashboard features
- **[Life API Integration](./apps/life/API_INTEGRATION_V2.md)** - Frontend data fetching

## 🏗️ Project Structure

```
mutualist/
├── apps/
│   ├── api/          # NestJS Backend (Port 3002)
│   ├── admin/        # Next.js Admin Dashboard (Port 3001)
│   └── life/         # Next.js Public Website (Port 3000)
├── node_modules/     # Shared dependencies
└── package.json      # Monorepo configuration
```

## 🛠️ Tech Stack

### Backend (API)

- **Framework:** NestJS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Storage:** Supabase Storage
- **Language:** TypeScript

### Frontend (Admin & Life)

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** SWR (Life), Native Fetch (Admin)
- **Animations:** GSAP
- **UI Components:** Shadcn/ui (Admin)

## 📦 Features

### Admin Dashboard

- ✅ Portfolio CRUD operations
- ✅ Image upload to Supabase Storage
- ✅ Dynamic form with multiple images
- ✅ Preview before publish
- ✅ Authentication (NextAuth)

### Public Website (Life)

- ✅ Infinite canvas interface
- ✅ Drag & pan navigation
- ✅ Real-time data from API
- ✅ Auto-refresh every 30s
- ✅ Offline fallback
- ✅ Project detail modal
- ✅ Image carousel

### API

- ✅ RESTful endpoints
- ✅ File upload handling
- ✅ Auto-delete images on portfolio delete
- ✅ Category management
- ✅ CORS enabled
- ✅ Validation & error handling

## 🔧 Development

### Prerequisites

- Bun v1.0+
- Node.js v18+
- Supabase account

### Commands

```bash
# Install dependencies
bun install

# Development (all apps)
bun run dev

# Development (individual)
cd apps/api && bun run dev
cd apps/admin && bun run dev
cd apps/life && bun run dev

# Build (all apps)
bun run build

# Lint
bun run lint

# Type check
bun run type-check
```

### Database Commands

```bash
cd apps/api

# Generate Prisma Client
bunx prisma generate

# Push schema changes
bunx prisma db push

# Create migration
bunx prisma migrate dev --name migration_name

# Open Prisma Studio
bunx prisma studio
```

## 🌍 Environment Variables

Each app requires environment variables. Copy from `.env.example`:

### API (`apps/api/.env`)

```env
DATABASE_URL=          # Supabase PostgreSQL URL
DIRECT_URL=            # Direct connection URL
JWT_SECRET=            # JWT secret key
PORT=3002              # API port
SUPABASE_URL=          # Supabase project URL
SUPABASE_SERVICE_KEY=  # Supabase service role key
```

### Admin (`apps/admin/.env.local`)

```env
NEXT_PUBLIC_API_URL=              # API endpoint
NEXT_PUBLIC_SUPABASE_URL=         # Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon key
NEXTAUTH_URL=                     # NextAuth URL
NEXTAUTH_SECRET=                  # NextAuth secret
```

### Life (`apps/life/.env.local`)

```env
NEXT_PUBLIC_API_URL=  # API endpoint
```

See [Environment Setup Guide](./ENVIRONMENT_SETUP.md) for detailed instructions.

## 📖 API Endpoints

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/portfolios`            | Get all portfolios  |
| GET    | `/api/portfolios/:id`        | Get portfolio by ID |
| POST   | `/api/portfolios`            | Create portfolio    |
| PUT    | `/api/portfolios/:id`        | Update portfolio    |
| DELETE | `/api/portfolios/:id`        | Delete portfolio    |
| GET    | `/api/portfolios/categories` | Get categories      |
| POST   | `/api/upload`                | Upload file         |

## 🤝 Contributing

1. Read [Developer Onboarding](./DEVELOPER_ONBOARDING.md)
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 🐛 Troubleshooting

See [Developer Onboarding - Troubleshooting](./DEVELOPER_ONBOARDING.md#troubleshooting) for common issues and solutions.

## 📄 License

[Your License Here]

## 👥 Team

- **Project Lead:** [Name]
- **Backend Developer:** [Name]
- **Frontend Developer:** [Name]
- **Designer:** [Name]

## 🔗 Links

- **Production:** [URL]
- **Staging:** [URL]
- **Supabase Dashboard:** [URL]
- **Documentation:** [URL]

---

**Built with ❤️ by Mutualist Team**

---

## 🌐 Network Access (Mobile Testing)

### **Quick Setup (Automated)**

Run this script to automatically configure network access:

```bash
# PowerShell (as Administrator)
.\setup-network.ps1
```

This will:

- ✅ Detect your IP address
- ✅ Update all .env files
- ✅ Configure for network access

### **Configure Firewall**

```bash
# PowerShell (as Administrator)
.\setup-firewall.ps1
```

This will:

- ✅ Allow ports 3000, 3001, 3002
- ✅ Enable access from other devices

### **Manual Setup**

1. **Find your IP:**

   ```bash
   ipconfig  # Windows
   ```

2. **Update .env files:**

   ```bash
   # apps/life/.env.local
   NEXT_PUBLIC_API_URL=http://YOUR_IP:3002/api

   # apps/admin/.env.local
   NEXT_PUBLIC_API_URL=http://YOUR_IP:3002/api
   NEXTAUTH_URL=http://YOUR_IP:3001
   ```

3. **Start apps and access from phone:**
   ```
   http://YOUR_IP:3000  (Life)
   http://YOUR_IP:3001  (Admin)
   ```

See `NETWORK_ACCESS_GUIDE.md` for detailed instructions.

---
