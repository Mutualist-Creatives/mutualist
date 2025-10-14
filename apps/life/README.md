# Life App - Portfolio Showcase

Aplikasi portfolio showcase dengan infinite canvas yang terintegrasi dengan backend API.

## Features

- 🎨 **Infinite Canvas** - Scroll dan drag untuk explore portfolio
- 🔄 **Dynamic Data** - Portfolio data dari API backend
- 📱 **Responsive** - Optimized untuk berbagai ukuran layar
- ⚡ **Fast Loading** - Optimized rendering dengan virtual scrolling
- 🎭 **Interactive** - Hover effects dan modal preview

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- API Integration dengan NestJS backend

## Prerequisites

Pastikan API backend sudah running:

```bash
cd apps/api
npm run dev
```

## Getting Started

1. Install dependencies (jika belum):

```bash
npm install
```

2. Setup environment variables:

```bash
# File: .env.local
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

3. Run development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

Life app sekarang terintegrasi dengan backend API untuk menampilkan portfolio secara dinamis.

### Data Flow

```
Admin App → API Backend → Database
                ↓
         Life App (display)
```

### Endpoints Used

- `GET /api/portfolios` - Fetch all portfolios
- `GET /api/portfolios/:id` - Fetch single portfolio
- `GET /api/portfolios/categories` - Fetch categories

Lihat [API_INTEGRATION.md](./API_INTEGRATION.md) untuk dokumentasi lengkap.

## Project Structure

```
apps/life/
├── app/                    # Next.js app router
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── infinite-canvas.tsx    # Main canvas component
│   ├── portofolio-card.tsx   # Portfolio card
│   ├── project-modal.tsx     # Detail modal
│   └── fixed-button.tsx      # Settings button
├── lib/                   # Utilities
│   └── api.ts            # API client
├── data/                  # Static data (fallback)
│   ├── portofolio-data.ts
│   └── types.ts
└── public/               # Static assets
```

## How It Works

1. **Data Fetching**: Component fetch portfolio dari API saat mount
2. **Fallback**: Jika API gagal, gunakan data statis
3. **Infinite Loop**: Portfolio di-render dalam grid infinite dengan modular arithmetic
4. **Virtual Scrolling**: Hanya render item yang visible untuk performa optimal

## Development

Edit files di:

- `app/page.tsx` - Main page
- `components/infinite-canvas.tsx` - Canvas logic
- `lib/api.ts` - API integration

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
