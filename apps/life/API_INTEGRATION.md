# Integrasi API Portfolio - Life App

## Overview

Life app sekarang terintegrasi dengan API backend untuk menampilkan data portfolio secara dinamis dari database, menggantikan data statis yang sebelumnya hardcoded.

## Arsitektur

### Flow Data

```
Admin App → API Backend → Database (PostgreSQL)
                ↓
         Life App (fetch data)
```

1. **Admin App** (`/apps/admin`) - Input dan manage portfolio melalui UI
2. **API Backend** (`/apps/api`) - NestJS API dengan Prisma ORM
3. **Database** - PostgreSQL (Supabase)
4. **Life App** (`/apps/life`) - Display portfolio dalam infinite canvas

## File yang Dimodifikasi

### 1. `/apps/life/lib/api.ts` (BARU)

API client untuk berkomunikasi dengan backend:

- `portfolioApi.getAll()` - Fetch semua portfolio
- `portfolioApi.getById(id)` - Fetch portfolio by ID
- `portfolioApi.getCategories()` - Fetch kategori unik

### 2. `/apps/life/components/infinite-canvas.tsx`

Perubahan utama:

- Import `portfolioApi` dan tipe `Portfolio`
- State baru: `portfolios` dan `isLoading`
- `useEffect` untuk fetch data dari API saat component mount
- Fallback ke data statis jika API gagal atau kosong
- Loading state dan empty state UI

## Konfigurasi

### Environment Variables

File: `/apps/life/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

Untuk production, update dengan URL API production Anda.

## Cara Kerja

### 1. Fetch Data

Saat component `InfiniteCanvas` di-mount:

```typescript
useEffect(() => {
  const fetchPortfolios = async () => {
    setIsLoading(true);
    const data = await portfolioApi.getAll();

    if (data.length > 0) {
      setPortfolios(data); // Gunakan data dari API
    } else {
      // Fallback ke data statis
      const fallbackData = portfolioItems.map((item) => ({
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setPortfolios(fallbackData);
    }
    setIsLoading(false);
  };

  fetchPortfolios();
}, []);
```

### 2. Render Data

Data yang di-fetch digunakan dalam infinite loop rendering:

```typescript
const baseItem = portfolios[itemIndex % portfolios.length];
```

### 3. Error Handling

- Jika API gagal, app akan fallback ke data statis
- Console error untuk debugging
- Loading state untuk UX yang lebih baik

## Testing

### 1. Pastikan API Running

```bash
cd apps/api
npm run dev
```

API akan berjalan di `http://localhost:3002`

### 2. Pastikan Database Terisi

Gunakan Admin App untuk menambahkan portfolio:

```bash
cd apps/admin
npm run dev
```

Buka `http://localhost:3001` dan login untuk manage portfolio

### 3. Jalankan Life App

```bash
cd apps/life
npm run dev
```

Buka `http://localhost:3000` untuk melihat portfolio

## Fitur

### ✅ Dynamic Data

- Portfolio ditampilkan dari database real-time
- Tidak perlu rebuild untuk update data
- Data dikelola melalui Admin App

### ✅ Fallback Mechanism

- Jika API down, app tetap berfungsi dengan data statis
- Tidak ada error yang mengganggu user experience

### ✅ Loading States

- Loading indicator saat fetch data
- Empty state jika tidak ada portfolio

### ✅ Type Safety

- Full TypeScript support
- Interface `Portfolio` yang konsisten

## API Endpoints yang Digunakan

### GET /api/portfolios

Fetch semua portfolio

```typescript
Response: Portfolio[]
```

### GET /api/portfolios/:id

Fetch portfolio by ID

```typescript
Response: Portfolio;
```

### GET /api/portfolios/categories

Fetch kategori unik

```typescript
Response: string[]
```

## Troubleshooting

### Portfolio tidak muncul

1. Cek API running: `http://localhost:3002/api/portfolios`
2. Cek console browser untuk error
3. Pastikan `.env.local` sudah benar
4. Pastikan database terisi dengan data

### CORS Error

Jika ada CORS error, pastikan API sudah enable CORS untuk origin Life app.

### Data tidak update

- Life app fetch data saat page load
- Refresh browser untuk fetch data terbaru
- Atau implement auto-refresh/polling jika diperlukan

## Next Steps

### Potential Improvements

1. **Real-time Updates** - Implement WebSocket atau polling untuk auto-refresh
2. **Caching** - Implement client-side caching dengan SWR atau React Query
3. **Pagination** - Untuk performa lebih baik jika portfolio banyak
4. **Search & Filter** - Filter portfolio by category dari API
5. **Optimistic Updates** - Update UI sebelum API response

## Struktur Data

### Portfolio Interface

```typescript
interface Portfolio {
  id: string;
  title: string;
  createdBy: string;
  year: string;
  category: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Kesimpulan

Life app sekarang fully integrated dengan backend API, memungkinkan:

- ✅ Dynamic content management
- ✅ Real-time data dari database
- ✅ Centralized data management melalui Admin App
- ✅ Scalable architecture untuk future improvements
