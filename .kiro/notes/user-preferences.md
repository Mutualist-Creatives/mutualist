# User Preferences

## Package Manager

- **Always use Bun** instead of npm
- Commands:
  - `bun install` (not npm install)
  - `bun run dev` (not npm run dev)
  - `bunx` (not npx)

## Project Structure

- Monorepo with 3 apps:
  - `/apps/api` - NestJS backend (port 3002)
  - `/apps/admin` - Next.js admin dashboard (port 3001)
  - `/apps/life` - Next.js public portfolio (port 3000)

## Database

- PostgreSQL via Supabase
- Prisma ORM
- Supabase Storage for images

## Tech Stack

- Backend: NestJS + Prisma
- Frontend: Next.js 15 + TypeScript
- Styling: Tailwind CSS
- Data Fetching: SWR (for Life app)
- Animations: GSAP

## Notes

- User prefers Indonesian language for communication
- Focus on minimal, clean code
- Performance and UX are priorities
