# Install Upload Dependencies

## Required Packages

Untuk fitur upload dan delete images di Supabase, install dependencies berikut:

```bash
cd apps/api
bun add @supabase/supabase-js multer
bun add -d @types/multer
```

## Dependencies Explanation

- `@supabase/supabase-js` - Supabase client untuk storage operations
- `multer` - Middleware untuk handle multipart/form-data (file uploads)
- `@types/multer` - TypeScript types untuk multer

## Environment Variables

Tambahkan ke `apps/api/.env`:

```env
SUPABASE_URL=https://aqmiasmqtueuqvdsgiez.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

**Note:** Gunakan `SUPABASE_SERVICE_KEY` (bukan ANON_KEY) untuk backend karena memiliki full access untuk delete operations.

Dapatkan credentials dari Supabase Dashboard:

1. Go to Project Settings
2. API Section
3. Copy Project URL dan anon/public key

## After Installation

Restart API server:

```bash
bun run dev
```

API akan support:

- ✅ Upload images ke Supabase Storage
- ✅ Delete images saat portfolio dihapus
- ✅ Delete old images saat portfolio diupdate
